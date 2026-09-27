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
    // El lock transaccional hace atómico el bloque idempotencia/cuota/insert.
    // Sin él, dos requests concurrentes podrían observar el mismo COUNT.
    await this.repository.lockTenantAdmission(database, tenantId);

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

    return { job, idempotent: false };
  }

  async getJob(database: TenantTransaction, tenantId: string, jobId: string) {
    const job = await this.repository.findJobById(database, tenantId, jobId);
    if (!job) {
      throw new AppError(404, 'El trabajo de extracción solicitado no existe');
    }
    return job;
  }

  async processNextJob(): Promise<boolean> {
    const job = await this.repository.claimNextDueJob();
    if (!job) return false;

    // El lease ya fue adquirido de forma atómica por PostgreSQL. Esta lectura
    // queda en una transacción RLS del tenant, y la llamada al LLM fuera de ella.
    const snapshot = await withTenantTransaction(job.tenantId, (tx) =>
      this.requirementsRepo.getDocumentSnapshot(tx, job.tenderId, job.documentVersionId));
    if (!snapshot) {
      await withTenantTransaction(job.tenantId, (tx) => this.repository.updateJob(tx, job.tenantId, job.id, {
        status: 'FAILED', errorMessage: 'El snapshot documental verificable no existe', retryAfterTimestamp: null,
        leaseExpiresAt: null,
      }));
      return true;
    }

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
      await withTenantTransaction(job.tenantId, async (tx) => {
        const { extraction } = await this.reqService.submitExtraction(
          tx,
          job.tenantId,
          extractionResult,
        );

        await this.repository.updateJob(tx, job.tenantId, job.id, {
          status: 'COMPLETED',
          resultExtractionId: extraction.id,
          errorMessage: null,
          retryAfterTimestamp: null,
          leaseExpiresAt: null,
        });
      });
    } catch (error: unknown) {
      const isAppError = error instanceof AppError;
      const statusCode = isAppError ? error.statusCode : 500;
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

      // Control específico de rate-limiting (429) o fallos de red (502/503)
      const isRateLimitOrTransient =
        statusCode === 429 || statusCode === 502 || statusCode === 503;

      let retryAfterSeconds = Math.min(60, Math.pow(2, job.attemptCount) * 5);
      if (isAppError && error.details && typeof (error.details as Record<string, unknown>).retryAfterSeconds === 'number') {
        retryAfterSeconds = (error.details as Record<string, unknown>).retryAfterSeconds as number;
      }

      const willRetry = isRateLimitOrTransient && job.attemptCount < job.maxAttempts;

      await withTenantTransaction(job.tenantId, async (tx) => {
        await this.repository.updateJob(tx, job.tenantId, job.id, {
          status: willRetry ? 'PENDING' : 'FAILED',
          errorMessage,
          retryAfterTimestamp: willRetry
            ? new Date(Date.now() + retryAfterSeconds * 1000)
            : null,
          leaseExpiresAt: null,
        });
      });
    }
    return true;
  }
}

export const extractionJobsService = new ExtractionJobsService();
