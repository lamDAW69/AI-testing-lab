import assert from 'node:assert/strict';
import { test } from 'node:test';
import { OnboardingService, onboardingService } from '../../src/modules/onboarding/onboarding.service.js';
import type { AuthenticatedIdentity } from '../../src/middleware/auth.middleware.js';
import { AppError } from '../../src/middleware/error.middleware.js';
import { db } from '../../src/db/client.js';

// Helper para interceptar transacciones en tests unitarios de OnboardingService
function createMockDbScope() {
  const originalTx = db.transaction;
  let currentUserIdSetting: string | null = null;
  let currentTenantIdSetting: string | null = null;

  type QueryHandler = {
    membershipRows?: Array<{ tenantId: string; role: string }>;
    tenantRows?: Array<{ tenantId: string; name: string; taxId: string | null }>;
    provisionResult?: { rows: Array<unknown> };
    provisionError?: unknown;
    recheckMembershipRows?: Array<{ tenantId: string; role: string }>;
  };

  let handler: QueryHandler = {};
  let membershipQueryCount = 0;

  db.transaction = (async (cb: any) => {
    const fakeTx: any = {
      execute: async (sqlQuery: any) => {
        const queryText = typeof sqlQuery === 'object' && sqlQuery !== null && 'queryChunks' in sqlQuery
          ? JSON.stringify(sqlQuery.queryChunks)
          : String(sqlQuery);

        // Capturar configuración de variables locales de sesión RLS (Anti-BOLA/IDOR)
        if (queryText.includes('app.current_user_id')) {
          const match = queryText.match(/app\.current_user_id.*?value["':\s]+([^"',}\]]+)/i);
          if (match) {
            currentUserIdSetting = match[1];
          }
        }
        if (queryText.includes('app.current_tenant_id')) {
          const match = queryText.match(/app\.current_tenant_id.*?value["':\s]+([^"',}\]]+)/i);
          if (match) {
            currentTenantIdSetting = match[1];
          }
        }

        // Simular ejecución del stored procedure provision_first_tenant_for_user
        if (queryText.includes('provision_first_tenant_for_user')) {
          if (handler.provisionError) {
            throw handler.provisionError;
          }
          return handler.provisionResult ?? {
            rows: [{
              tenantId: '55555555-5555-4555-8555-555555555555',
              name: 'Empresa Test S.L.',
              taxId: 'B-12345678',
              role: 'owner',
              created: true,
            }],
          };
        }

        return { rows: [] };
      },
      select: () => ({
        from: () => ({
          where: () => ({
            limit: async () => {
              membershipQueryCount++;
              if (membershipQueryCount > 1 && handler.recheckMembershipRows) {
                return handler.recheckMembershipRows;
              }
              return handler.membershipRows ?? [];
            },
          }),
          leftJoin: () => ({
            where: () => ({
              limit: async () => handler.tenantRows ?? [],
            }),
          }),
        }),
      }),
    };

    return await cb(fakeTx);
  }) as any;

  return {
    setHandler: (h: QueryHandler) => {
      handler = h;
      membershipQueryCount = 0;
    },
    getCurrentUserIdSetting: () => currentUserIdSetting,
    getCurrentTenantIdSetting: () => currentTenantIdSetting,
    restore: () => {
      db.transaction = originalTx;
    },
  };
}

test('Test 1: Usuario con membresía previa existente devuelve la organización sin autoprovisionar', async () => {
  const mockDb = createMockDbScope();
  try {
    const existingUserId = '11111111-1111-4111-8111-111111111111';
    const existingTenantId = '22222222-2222-4222-8222-222222222222';

    mockDb.setHandler({
      membershipRows: [{ tenantId: existingTenantId, role: 'owner' }],
      tenantRows: [{ tenantId: existingTenantId, name: 'Empresa Existente S.L.', taxId: 'B-12345678' }],
    });

    const identity: AuthenticatedIdentity = Object.freeze({
      userId: existingUserId,
      email: 'operador@empresa.es',
      userMetadata: {
        company_name: 'Empresa Diferente En Metadata S.L.',
        tax_id: 'B-99999999',
      },
    });

    const result = await onboardingService.getOrProvisionMembership(identity, 'req-001');

    assert.ok(result !== null);
    assert.equal(result.tenantId, existingTenantId);
    assert.equal(result.name, 'Empresa Existente S.L.');
    assert.equal(result.taxId, 'B-12345678');
    assert.equal(result.role, 'owner');
    assert.equal(result.created, false);
  } finally {
    mockDb.restore();
  }
});

test('Test 2: Usuario sin membresía pero con metadatos corporativos en JWT autoprovisiona tenant con rol owner', async () => {
  const mockDb = createMockDbScope();
  try {
    const newUserId = '33333333-3333-4333-8333-333333333333';
    const provisionedTenantId = '44444444-4444-4444-8444-444444444444';

    // 2a. Metadatos corporativos en formato snake_case estándar
    mockDb.setHandler({
      membershipRows: [], // Sin membresía previa
      provisionResult: {
        rows: [{
          tenantId: provisionedTenantId,
          name: 'NovaTech Solutions S.L.',
          taxId: 'B-99887766',
          role: 'owner',
          created: true,
        }],
      },
    });

    const identitySnake: AuthenticatedIdentity = Object.freeze({
      userId: newUserId,
      email: 'nuevo@novatech.es',
      userMetadata: {
        company_name: 'NovaTech Solutions S.L.',
        tax_id: 'B-99887766',
        cpv_sector: '72000000',
      },
    });

    const resultSnake = await onboardingService.getOrProvisionMembership(identitySnake, 'req-002');

    assert.ok(resultSnake !== null);
    assert.equal(resultSnake.tenantId, provisionedTenantId);
    assert.equal(resultSnake.name, 'NovaTech Solutions S.L.');
    assert.equal(resultSnake.taxId, 'B-99887766');
    assert.equal(resultSnake.role, 'owner');
    assert.equal(resultSnake.created, true);

    // 2b. Metadatos corporativos en formato camelCase (tolerancia bidireccional)
    const camelTenantId = '66666666-6666-4666-8666-666666666666';
    mockDb.setHandler({
      membershipRows: [],
      provisionResult: {
        rows: [{
          tenantId: camelTenantId,
          name: 'CamelCase Consultoría S.L.',
          taxId: 'A-11223344',
          role: 'owner',
          created: true,
        }],
      },
    });

    const identityCamel: AuthenticatedIdentity = Object.freeze({
      userId: newUserId,
      email: 'camel@consultoria.es',
      userMetadata: {
        companyName: 'CamelCase Consultoría S.L.',
        taxId: 'A-11223344',
        cpvCode: '48000000',
      },
    });

    const resultCamel = await onboardingService.getOrProvisionMembership(identityCamel, 'req-003');

    assert.ok(resultCamel !== null);
    assert.equal(resultCamel.tenantId, camelTenantId);
    assert.equal(resultCamel.name, 'CamelCase Consultoría S.L.');
    assert.equal(resultCamel.role, 'owner');
    assert.equal(resultCamel.created, true);
  } finally {
    mockDb.restore();
  }
});

test('Test 3: Usuario sin membresía y sin metadatos corporativos devuelve null (Zero 403 Forbidden)', async () => {
  const mockDb = createMockDbScope();
  try {
    const unprovisionedUserId = '77777777-7777-4777-8777-777777777777';

    mockDb.setHandler({
      membershipRows: [], // Sin membresía
    });

    // Identidad sin datos de empresa (solo datos personales del operador)
    const identityPersonalOnly: AuthenticatedIdentity = Object.freeze({
      userId: unprovisionedUserId,
      email: 'juan.nadie@ejemplo.es',
      userMetadata: {
        full_name: 'Juan Nadie',
      },
    });

    const result = await onboardingService.getOrProvisionMembership(identityPersonalOnly, 'req-004');

    // Debe devolver null limpiamente sin arrojar error 403
    assert.equal(result, null);

    // Identidad con metadata vacía
    const identityEmpty: AuthenticatedIdentity = Object.freeze({
      userId: unprovisionedUserId,
      email: 'vacio@ejemplo.es',
    });

    const resultEmpty = await onboardingService.getOrProvisionMembership(identityEmpty, 'req-005');
    assert.equal(resultEmpty, null);

    // Identidad con CIF inválido (no pasa validación de esquema)
    const identityInvalidTax: AuthenticatedIdentity = Object.freeze({
      userId: unprovisionedUserId,
      email: 'mal-cif@ejemplo.es',
      userMetadata: {
        company_name: 'Empresa CIF Malo S.L.',
        tax_id: '!!!INVALIDO!!!',
      },
    });

    const resultInvalidTax = await onboardingService.getOrProvisionMembership(identityInvalidTax, 'req-006');
    assert.equal(resultInvalidTax, null);
  } finally {
    mockDb.restore();
  }
});

test('Test 4: Recuperación transparente de condición de carrera y conflicto concurrente (P0001 / 409)', async () => {
  const mockDb = createMockDbScope();
  try {
    const raceUserId = '88888888-8888-4888-8888-888888888888';
    const concurrentTenantId = '99999999-9999-4999-8999-999999999999';

    // 4a. Conflicto PostgreSQL P0001 (lanzado por provision_first_tenant_for_user en caso de duplicidad)
    const pgConflictError = Object.assign(new Error('Ya existe una organización para este usuario'), {
      code: 'P0001',
    });

    mockDb.setHandler({
      membershipRows: [], // En el primer check no había membresía
      provisionError: pgConflictError,
      recheckMembershipRows: [{ tenantId: concurrentTenantId, role: 'owner' }], // En el re-check tras conflicto, la encuentra
      tenantRows: [{ tenantId: concurrentTenantId, name: 'Empresa Paralela S.L.', taxId: 'B-77889900' }],
    });

    const identity: AuthenticatedIdentity = Object.freeze({
      userId: raceUserId,
      email: 'race@paralela.es',
      userMetadata: {
        company_name: 'Empresa Paralela S.L.',
        tax_id: 'B-77889900',
      },
    });

    const resultPg = await onboardingService.getOrProvisionMembership(identity, 'req-race-1');

    assert.ok(resultPg !== null);
    assert.equal(resultPg.tenantId, concurrentTenantId);
    assert.equal(resultPg.name, 'Empresa Paralela S.L.');
    assert.equal(resultPg.role, 'owner');
    assert.equal(resultPg.created, false);

    // 4b. Conflicto con AppError(409)
    const appConflictError = new AppError(409, 'Esta cuenta ya pertenece a una organización.');

    mockDb.setHandler({
      membershipRows: [],
      provisionError: appConflictError,
      recheckMembershipRows: [{ tenantId: concurrentTenantId, role: 'owner' }],
      tenantRows: [{ tenantId: concurrentTenantId, name: 'Empresa Paralela S.L.', taxId: 'B-77889900' }],
    });

    const resultApp = await onboardingService.getOrProvisionMembership(identity, 'req-race-2');

    assert.ok(resultApp !== null);
    assert.equal(resultApp.tenantId, concurrentTenantId);
    assert.equal(resultApp.role, 'owner');
    assert.equal(resultApp.created, false);
  } finally {
    mockDb.restore();
  }
});

test('Test 5: Verificación estricta de protección Anti-BOLA / Anti-IDOR', async () => {
  const mockDb = createMockDbScope();
  try {
    const genuineUserId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    const spoofedUserId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
    const spoofedTenantId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

    let capturedUserIdInProvision: string | null = null;

    class BolaAuditService extends OnboardingService {
      override async provisionFirstTenant(userId: string, requestId: string, input: any) {
        capturedUserIdInProvision = userId;
        return {
          tenantId: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
          name: input.legalName,
          taxId: input.taxId,
          role: 'owner' as const,
          created: true,
        };
      }
    }

    const auditService = new BolaAuditService();

    // El atacante inyecta userId, tenantId y rol de administrador en userMetadata (Mass Assignment / IDOR attempt)
    const maliciousIdentity: AuthenticatedIdentity = Object.freeze({
      userId: genuineUserId,
      email: 'atacante@evil.test',
      userMetadata: {
        company_name: 'Empresa Suplantadora S.L.',
        tax_id: 'B-12345678',
        userId: spoofedUserId,
        tenantId: spoofedTenantId,
        role: 'superadmin',
        is_admin: true,
      },
    });

    mockDb.setHandler({
      membershipRows: [],
    });

    const result = await auditService.getOrProvisionMembership(maliciousIdentity, 'req-audit-bola');

    assert.ok(result !== null);
    // El userId enviado a la función de provisión DEBE ser exclusivamente genuineUserId del JWT verificado
    assert.equal(capturedUserIdInProvision, genuineUserId);
    assert.notEqual(capturedUserIdInProvision, spoofedUserId);
    // El rol asignado debe ser canónicamente 'owner', ignorando el spoofed 'superadmin'
    assert.equal(result.role, 'owner');
  } finally {
    mockDb.restore();
  }
});
