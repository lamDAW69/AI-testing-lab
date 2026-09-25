import assert from 'node:assert/strict';
import test from 'node:test';
import { AppError } from '../../src/middleware/error.middleware.js';
import { validateGeminiCitations } from '../../src/modules/requirements/gemini-requirements-extractor.js';

const text = 'El licitador deberá acreditar tres años de experiencia.';
const validOutput = {
  requirements: [{
    category: 'TECHNICAL', requirementType: 'MANDATORY', sourceStatus: 'CITED',
    summary: 'Experiencia mínima de tres años para participar.',
    extractedText: 'El licitador deberá acreditar tres años de experiencia.',
    confidence: 90,
    citations: [{ startOffset: 0, endOffset: text.length, quotedText: text }],
  }],
} as const;

test('una cita generada solo se acepta si coincide exactamente con el snapshot', () => {
  assert.doesNotThrow(() => validateGeminiCitations(text, validOutput));
  const forgedOutput = {
    requirements: [{ ...validOutput.requirements[0], citations: [{
      startOffset: 0, endOffset: text.length, quotedText: 'Texto inventado por el modelo.',
    }] }],
  };
  assert.throws(
    () => validateGeminiCitations(text, forgedOutput),
    (error: unknown) => error instanceof AppError && error.statusCode === 422,
  );
});
