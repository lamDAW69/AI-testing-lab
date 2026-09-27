import test from 'node:test';
import assert from 'node:assert/strict';
import { CreateExtractionJobSchema } from '../../src/modules/requirements/requirements.schema.js';
import { ExtractionJobsService, MAX_CONCURRENT_JOBS_PER_TENANT } from '../../src/modules/requirements/extraction-jobs.service.js';
import { AppError } from '../../src/middleware/error.middleware.js';

test('CreateExtractionJobSchema valida parámetros estrictos y rechaza inyecciones de campos', () => {
  const valid = {
    idempotencyKey: '00000000-0000-0000-0000-000000000001',
    tenderId: '00000000-0000-0000-0000-000000000002',
    documentVersionId: '00000000-0000-0000-0000-000000000003',
  };

  const parsed = CreateExtractionJobSchema.parse(valid);
  assert.equal(parsed.idempotencyKey, valid.idempotencyKey);

  // Intento de inyectar estado o tenantId privilegiado
  assert.throws(() => {
    CreateExtractionJobSchema.parse({
      ...valid,
      status: 'COMPLETED',
      tenantId: '00000000-0000-0000-0000-000000000099',
    });
  });
});

test('ExtractionJobsService rechaza peticiones con 429 si se excede la cuota de concurrencia del tenant', async () => {
  const fakeRepo = {
    lockTenantAdmission: async () => undefined,
    findJobByIdempotency: async () => undefined,
    countActiveJobsForTenant: async () => MAX_CONCURRENT_JOBS_PER_TENANT, // Simula que ya hay 2 jobs activos
    createJob: async () => { throw new Error('No debe ser llamado'); },
  } as any;

  const fakeReqRepo = {
    verifyDocumentVersion: async () => ({ id: 'doc-1', contentHash: 'hash', extractedTextSha256: 'sha' }),
  } as any;

  const service = new ExtractionJobsService(fakeRepo, fakeReqRepo, {} as any, {} as any);

  await assert.rejects(
    async () => {
      await service.createJob({} as any, 'tenant-123', {
        idempotencyKey: '00000000-0000-0000-0000-000000000001',
        tenderId: '00000000-0000-0000-0000-000000000002',
        documentVersionId: '00000000-0000-0000-0000-000000000003',
      });
    },
    (err: unknown) => {
      assert(err instanceof AppError);
      assert.equal(err.statusCode, 429);
      assert(err.message.includes('Límite de extracciones simultáneas'));
      return true;
    },
  );
});

test('ExtractionJobsService devuelve el trabajo existente de forma idempotente sin duplicar cola', async () => {
  const existingJob = {
    id: 'job-existing-1',
    tenantId: 'tenant-123',
    status: 'PROCESSING',
    idempotencyKey: '00000000-0000-0000-0000-000000000001',
  };

  const fakeRepo = {
    lockTenantAdmission: async () => undefined,
    findJobByIdempotency: async () => existingJob,
    countActiveJobsForTenant: async () => 0,
    createJob: async () => { throw new Error('No debe crear duplicado'); },
  } as any;

  const service = new ExtractionJobsService(fakeRepo, {} as any, {} as any, {} as any);

  const result = await service.createJob({} as any, 'tenant-123', {
    idempotencyKey: '00000000-0000-0000-0000-000000000001',
    tenderId: '00000000-0000-0000-0000-000000000002',
    documentVersionId: '00000000-0000-0000-0000-000000000003',
  });

  assert.equal(result.idempotent, true);
  assert.equal(result.job.id, 'job-existing-1');
});

test('ExtractionJobsService adquiere el lock transaccional antes de comprobar la cuota', async () => {
  let lockCalls = 0;
  const fakeRepo = {
    lockTenantAdmission: async () => { lockCalls += 1; },
    findJobByIdempotency: async () => ({ id: 'job-existing-2' }),
  } as any;
  const service = new ExtractionJobsService(fakeRepo, {} as any, {} as any, {} as any);

  await service.createJob({} as any, 'tenant-123', {
    idempotencyKey: '00000000-0000-0000-0000-000000000001',
    tenderId: '00000000-0000-0000-0000-000000000002',
    documentVersionId: '00000000-0000-0000-0000-000000000003',
  });

  assert.equal(lockCalls, 1);
});
