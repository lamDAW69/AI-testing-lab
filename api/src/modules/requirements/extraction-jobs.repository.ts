import { and, eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db, type TenantTransaction } from '../../db/client.js';
import { extractionJobs, type ExtractionJob, type NewExtractionJob } from '../../db/schema.js';
import type { CreateExtractionJobInput } from './requirements.schema.js';

export class ExtractionJobsRepository {
  /**
   * Serializa la admisión de trabajos de una organización durante la transacción.
   * PostgreSQL libera el advisory lock automáticamente al hacer commit/rollback,
   * por lo que el COUNT + INSERT posterior no puede sufrir una carrera.
   */
  async lockTenantAdmission(database: TenantTransaction, tenantId: string): Promise<void> {
    await database.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${tenantId}))`);
  }

  async findJobById(
    database: TenantTransaction,
    tenantId: string,
    id: string,
  ): Promise<ExtractionJob | undefined> {
    const rows = await database
      .select()
      .from(extractionJobs)
      .where(and(eq(extractionJobs.id, id), eq(extractionJobs.tenantId, tenantId)))
      .limit(1);
    return rows[0];
  }

  async findJobByIdempotency(
    database: TenantTransaction,
    tenantId: string,
    idempotencyKey: string,
  ): Promise<ExtractionJob | undefined> {
    const rows = await database
      .select()
      .from(extractionJobs)
      .where(
        and(
          eq(extractionJobs.tenantId, tenantId),
          eq(extractionJobs.idempotencyKey, idempotencyKey),
        ),
      )
      .limit(1);
    return rows[0];
  }

  async countActiveJobsForTenant(
    database: TenantTransaction,
    tenantId: string,
  ): Promise<number> {
    const rows = await database
      .select({ count: sql<number>`count(*)::int` })
      .from(extractionJobs)
      .where(
        and(
          eq(extractionJobs.tenantId, tenantId),
          inArray(extractionJobs.status, ['PENDING', 'PROCESSING']),
        ),
      );
    return rows[0]?.count ?? 0;
  }

  async createJob(
    database: TenantTransaction,
    tenantId: string,
    input: CreateExtractionJobInput,
  ): Promise<ExtractionJob> {
    const rows = await database
      .insert(extractionJobs)
      .values({
        tenantId,
        tenderId: input.tenderId,
        documentVersionId: input.documentVersionId,
        idempotencyKey: input.idempotencyKey,
        status: 'PENDING',
        attemptCount: 0,
        maxAttempts: 3,
      })
      .returning();

    const job = rows[0];
    if (!job) {
      throw new Error('No se pudo crear el trabajo de extracción');
    }
    return job;
  }

  /**
   * Reclama un único trabajo mediante una función SQL SECURITY DEFINER,
   * deliberadamente mínima y sin parámetros. La función usa SKIP LOCKED y un
   * lease para que varios workers no procesen el mismo trabajo ni lo pierdan
   * tras un reinicio.
   */
  async claimNextDueJob(): Promise<{
    readonly id: string;
    readonly tenantId: string;
    readonly tenderId: string;
    readonly documentVersionId: string;
    readonly idempotencyKey: string;
    readonly attemptCount: number;
    readonly maxAttempts: number;
  } | undefined> {
    const result = await db.execute(sql`SELECT * FROM claim_next_extraction_job()`);
    const row = result.rows[0];
    if (!row) return undefined;
    const parsed = z.object({
      id: z.string().uuid(),
      tenant_id: z.string().uuid(),
      tender_id: z.string().uuid(),
      document_version_id: z.string().uuid(),
      idempotency_key: z.string().uuid(),
      attempt_count: z.number().int().nonnegative(),
      max_attempts: z.number().int().positive(),
    }).strict().parse(row);
    return {
      id: parsed.id,
      tenantId: parsed.tenant_id,
      tenderId: parsed.tender_id,
      documentVersionId: parsed.document_version_id,
      idempotencyKey: parsed.idempotency_key,
      attemptCount: parsed.attempt_count,
      maxAttempts: parsed.max_attempts,
    };
  }

  async updateJob(
    database: TenantTransaction,
    tenantId: string,
    id: string,
    data: Partial<NewExtractionJob>,
  ): Promise<ExtractionJob | undefined> {
    const rows = await database
      .update(extractionJobs)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(extractionJobs.id, id), eq(extractionJobs.tenantId, tenantId)))
      .returning();

    return rows[0];
  }
}

export const extractionJobsRepository = new ExtractionJobsRepository();
