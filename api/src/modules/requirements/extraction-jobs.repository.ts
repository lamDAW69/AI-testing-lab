import { and, eq, inArray, sql } from 'drizzle-orm';
import type { TenantTransaction } from '../../db/client.js';
import { extractionJobs, type ExtractionJob, type NewExtractionJob } from '../../db/schema.js';
import type { CreateExtractionJobInput } from './requirements.schema.js';

export class ExtractionJobsRepository {
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
