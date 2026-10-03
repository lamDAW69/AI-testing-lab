import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ProvisionTenantSchema } from '../../src/modules/onboarding/onboarding.schema.js';

test('onboarding acepta únicamente declaraciones corporativas mínimas', () => {
  const parsed = ProvisionTenantSchema.safeParse({
    legalName: 'NovaTech Solutions S.L.',
    taxId: 'b-99887766',
    cpvCode: '72000000',
  });

  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.taxId, 'B-99887766');
  }
});

test('onboarding rechaza mass assignment de identidad, tenant, rol y verificación', () => {
  const forged = ProvisionTenantSchema.safeParse({
    legalName: 'Empresa atacante S.L.',
    taxId: 'B-12345678',
    cpvCode: '72000000',
    tenantId: '11111111-1111-4111-8111-111111111111',
    userId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    role: 'owner',
    evidenceStatus: 'VERIFIED',
  });

  assert.equal(forged.success, false);
});

test('onboarding rechaza un CIF/NIF y CPV fuera de formato', () => {
  assert.equal(ProvisionTenantSchema.safeParse({
    legalName: 'Empresa sin formato',
    taxId: '!!!',
    cpvCode: 'invalido',
  }).success, false);
});
