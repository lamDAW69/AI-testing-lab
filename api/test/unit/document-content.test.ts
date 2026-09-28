import assert from 'node:assert/strict';
import test from 'node:test';
import { AppError } from '../../src/middleware/error.middleware.js';
import { assertAllowedDocumentUrl } from '../../src/modules/documents/document-content.service.js';

test('el descargador documental solo acepta HTTPS en el host exacto de la fuente', () => {
  const allowed = assertAllowedDocumentUrl(
    'https://contrataciondelestado.es/archivo/pliego.pdf',
    'https://contrataciondelestado.es',
  );
  assert.equal(allowed.hostname, 'contrataciondelestado.es');

  for (const maliciousUrl of [
    'http://contrataciondelestado.es/archivo/pliego.pdf',
    'https://sub.contrataciondelestado.es/archivo/pliego.pdf',
    'https://127.0.0.1/internal',
  ]) {
    assert.throws(
      () => assertAllowedDocumentUrl(maliciousUrl, 'https://contrataciondelestado.es'),
      (error: unknown) => error instanceof AppError && error.statusCode === 422,
    );
  }
});
