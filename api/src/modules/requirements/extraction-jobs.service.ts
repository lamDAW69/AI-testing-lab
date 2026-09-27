import { withTenantTransaction, type TenantTransaction } from '../../db/client.js';
import { AppError } from '../../middleware/error.middleware.js';
import type { CreateExtractionJobInput } from './requirements.schema.js';
import { ExtractionJobsRepository, extractionJobsRepository } from './extraction-jobs.repository.js';
import { RequirementsRepository, requirementsRepository } from './requirements.repository.js';
import { RequirementsService, requirementsService } from './requirements.service.js';
import { GeminiRequirementsExtractor, geminiRequirementsExtractor } from './gemini-requirements-extractor.js';

export const MAX_CONCURRENT_JOBS_PER_TENANT = 2;

export class ExtractionJobsService {
  constructor(
    private readonly repository: ExtractionJobsRepository = extractionJobsRepository,
    private readonly requirementsRepo: RequirementsRepository = requirementsRepository,
    private readonly reqService: RequirementsService = requirementsService,
    private readonly extractor: GeminiRequirementsExtractor = geminiRequirementsExtractor,
  ) {}

  async createJob(
    database: TenantTransaction,
    tenantId: string,
    input: CreateExtractionJobInput,
  ) {
    // 1. Idempotencia estricta por tenant y clave
    const existing = await this.repository.findJobByIdempotency(
      database,
      tenantId,
      input.idempotencyKey,
    );
    if (existing) {
      return { job: existing, idempotent: true };
    }

    // 2. Comprobar que el documento pertenece al expediente del inquilino
    const documentVersion = await this.requirementsRepo.verifyDocumentVersion(
      database,
      input.tenderId,
      input.documentVersionId,
    );
    if (!documentVersion) {
      throw new AppError(404, 'La versión documental solicitada no pertenece al expediente');
    }

    // 3. Control de cuota y concurrencia por tenant
    const activeJobs = await this.repository.countActiveJobsForTenant(database, tenantId);
    if (activeJobs >= MAX_CONCURRENT_JOBS_PER_TENANT) {
      throw new AppError(
        429,
        `Límite de extracciones simultáneas alcanzado para la organización (máximo ${MAX_CONCURRENT_JOBS_PER_TENANT} en proceso)`,
      );
    }

    // 4. Registrar trabajo en estado PENDING
    const job = await this.repository.createJob(database, tenantId, input);

    // 5. Encolar ejecución asíncrona fuera del ciclo de petición HTTP
    queueMicrotask(() => {
      this.processJob(tenantId, job.id).catch((err) => {
        console.error(`[ExtractionJob ${job.id}] Fallo no controlado en background worker:`, err);
      });
    });

    return { job, idempotent: false };
  }

  async getJob(database: TenantTransaction, tenantId: string, jobId: string) {
    const job = await this.repository.findJobById(database, tenantId, jobId);
    if (!job) {
      throw new AppError(404, 'El trabajo de extracción solicitado no existe');
    }
    return job;
  }

  async processJob(tenantId: string, jobId: string): Promise<void> {
    // Fase A: Transacción para reservar el job y leer snapshot (sin mantener bloqueo durante la IA)
    const setupResult = await withTenantTransaction(tenantId, async (tx) => {
      const current = await this.repository.findJobById(tx, tenantId, jobId);
      if (!current || (current.status !== 'PENDING' && current.status !== 'PROCESSING')) {
        return null;
      }

      if (current.retryAfterTimestamp && current.retryAfterTimestamp.getTime() > Date.now()) {
        return null;
      }

      const nextAttempt = current.attemptCount + 1;
      await this.repository.updateJob(tx, tenantId, jobId, {
        status: 'PROCESSING',
        attemptCount: nextAttempt,
      });

      const snapshot = await this.requirementsRepo.getDocumentSnapshot(
        tx,
        current.tenderId,
        current.documentVersionId,
      );

      return {
        job: current,
        attempt: nextAttempt,
        snapshot,
      };
    });

    if (!setupResult || !setupResult.snapshot) {
      return;
    }

    const { job, attempt, snapshot } = setupResult;

    // Fase B: Invocación del LLM fuera de la transacción de base de datos
    try {
      const extractionResult = await this.extractor.extract(
        {
          idempotencyKey: job.idempotencyKey,
          tenderId: job.tenderId,
          documentVersionId: job.documentVersionId,
        },
        snapshot.extractedText,
      );

      // Fase C: Persistir resultado y marcar COMPLETED en transacción aislada
      await withTenantTransaction(tenantId, async (tx) => {
        const { extraction } = await this.reqService.submitExtraction(
          tx,
          tenantId,
          extractionResult,
        );

        await this.repository.updateJob(tx, tenantId, jobId, {
          status: 'COMPLETED',
          resultExtractionId: extraction.id,
          errorMessage: null,
          retryAfterTimestamp: null,
        });
      });
    } catch (error: unknown) {
      const isAppError = error instanceof AppError;
      const statusCode = isAppError ? error.statusCode : 500;
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

      // Control específico de rate-limiting (429) o fallos de red (502/503)
      const isRateLimitOrTransient =
        statusCode === 429 || statusCode === 502 || statusCode === 503;

      let retryAfterSeconds = Math.min(60, Math.pow(2, attempt) * 5);
      if (isAppError && error.details && typeof (error.details as Record<string, unknown>).retryAfterSeconds === 'number') {
        retryAfterSeconds = (error.details as Record<string, unknown>).retryAfterSeconds as number;
      }

      const willRetry = isRateLimitOrTransient && attempt < job.maxAttempts;

      await withTenantTransaction(tenantId, async (tx) => {
        await this.repository.updateJob(tx, tenantId, jobId, {
          status: willRetry ? 'PENDING' : 'FAILED',
          errorMessage,
          retryAfterTimestamp: willRetry
            ? new Date(Date.now() + retryAfterSeconds * 1000)
            : null,
        });
      });

      if (willRetry) {
        setTimeout(() => {
          this.processJob(tenantId, jobId).catch((err) => {
            console.error(`[ExtractionJob ${jobId}] Fallo en reintento programado:`, err);
          });
        }, retryAfterSeconds * 1000);
      }
    }
  }
}

export const extractionJobsService = new ExtractionJobsService();
