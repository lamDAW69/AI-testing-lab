import { z } from 'zod';
import { env } from '../../config/env.js';
import { AppError } from '../../middleware/error.middleware.js';
import { calculateGeminiCostMicrounits } from '../requirements/gemini-requirements-extractor.js';
import {
  AssessmentStatusEnum,
  MatchTypeEnum,
  type AssessmentStatus,
  type MatchType,
} from './qualification.schema.js';

const PromptVersion = 'qualification-matcher-v1';
const ToolVersion = 'gemini-generate-content-v1beta';

export interface RequirementToMatch {
  id: string;
  category: string;
  requirementType: string;
  summary: string;
  extractedText: string;
  citations: Array<{ quotedText: string; sectionReference?: string | null }>;
}

export interface DossierEvidenceCandidate {
  id: string;
  sourceType: 'CERTIFICATION' | 'COMPANY_PROFILE' | 'DOSSIER_ITEM' | 'EXPERIENCE';
  title: string;
  description: string;
  validUntil?: Date | string | null;
}

export const MatcherEvaluationItemSchema = z.object({
  dossierItemId: z.string().min(1),
  matchType: MatchTypeEnum,
  excerpt: z.string().trim().min(3).max(2000),
  confidence: z.number().int().min(0).max(100),
}).strict();

export const MatcherOutputSchema = z.object({
  status: AssessmentStatusEnum,
  confidence: z.number().int().min(0).max(100),
  rationale: z.string().trim().min(5).max(3000),
  matches: z.array(MatcherEvaluationItemSchema).max(20),
}).strict();

export type MatcherOutput = z.infer<typeof MatcherOutputSchema>;

export interface QualificationMatchResult {
  status: AssessmentStatus;
  confidence: number;
  rationale: string;
  isBlocking: boolean;
  agent: {
    name: string;
    model: string;
    promptVersion: string;
    toolVersion: string;
    durationMs: number;
    costMicrounits: number;
  };
  evidences: Array<{
    sourceType: 'CERTIFICATION' | 'COMPANY_PROFILE' | 'DOSSIER_ITEM' | 'EXPERIENCE';
    sourceId: string;
    sourceTitle: string;
    matchType: MatchType;
    excerpt: string;
    confidence: number;
    validUntil?: Date | null;
  }>;
}

export class QualificationMatcherAgent {
  async evaluateRequirement(
    requirement: RequirementToMatch,
    dossier: DossierEvidenceCandidate[],
  ): Promise<QualificationMatchResult> {
    const startedAt = Date.now();

    // 1. Caso de dossier vacío: resolución determinista sin llamada innecesaria al LLM
    if (dossier.length === 0) {
      const isMandatory = requirement.requirementType === 'MANDATORY';
      return {
        status: isMandatory ? 'UNKNOWN' : 'NOT_APPLICABLE',
        confidence: 100,
        rationale: 'El dossier de la empresa no contiene documentos ni certificaciones para contrastar este requisito.',
        isBlocking: false,
        agent: {
          name: 'deterministic-dossier-matcher',
          model: 'deterministic-rules',
          promptVersion: PromptVersion,
          toolVersion: ToolVersion,
          durationMs: Date.now() - startedAt,
          costMicrounits: 0,
        },
        evidences: [],
      };
    }

    // 2. Si no hay clave de Gemini configurada, emitir fallo explícito
    if (!env.GEMINI_API_KEY) {
      throw new AppError(503, 'El servicio de IA para precalificación no está configurado (falta GEMINI_API_KEY)');
    }

    const validDossierIds = new Set(dossier.map((d) => d.id));
    const dossierMap = new Map(dossier.map((d) => [d.id, d]));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), env.GEMINI_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.GEMINI_MODEL)}:generateContent`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{
                text: [
                  'Eres un agente evaluador de contratación pública. Tu misión es contrastar un requisito del pliego contra el dossier de una empresa.',
                  'No inventes evidencias ni respondas con IDs de documentos que no hayan sido entregados.',
                  'Si el dossier no demuestra el cumplimiento del requisito, responde status "UNKNOWN" o "NOT_SUPPORTED".',
                  'Si las evidencias se contradicen, responde "CONFLICTING".',
                  'Si el requisito está plenamente respaldado por una o más evidencias válidas, responde "SUPPORTED".',
                  'Devuelve ÚNICAMENTE un JSON con esta estructura:',
                  '{"status":"SUPPORTED|NOT_SUPPORTED|UNKNOWN|CONFLICTING|NOT_APPLICABLE|NEEDS_EXPERT_REVIEW","confidence":90,"rationale":"Explicación concisa y profesional","matches":[{"dossierItemId":"id-de-la-lista","matchType":"SUPPORTS|CONTRADICTS|PARTIAL|INCONCLUSIVE","excerpt":"Texto literal relevante de la evidencia","confidence":90}]}',
                ].join(' '),
              }],
            },
            contents: [{
              role: 'user',
              parts: [{
                text: JSON.stringify({
                  requirement: {
                    category: requirement.category,
                    requirementType: requirement.requirementType,
                    summary: requirement.summary,
                    extractedText: requirement.extractedText,
                    citations: requirement.citations.map((c) => c.quotedText),
                  },
                  dossierCandidates: dossier.map((d) => ({
                    id: d.id,
                    sourceType: d.sourceType,
                    title: d.title,
                    description: d.description,
                    validUntil: d.validUntil ? String(d.validUntil) : null,
                  })),
                }),
              }],
            }],
            generationConfig: {
              temperature: 0,
              maxOutputTokens: 2048,
              responseMimeType: 'application/json',
            },
          }),
        },
      );
    } catch {
      throw new AppError(502, 'Fallo de comunicación con Gemini durante el matching de precalificación');
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      if (response.status === 429) {
        throw new AppError(429, 'Cuota de Gemini temporalmente agotada en precalificación');
      }
      const errText = await response.text().catch(() => '');
      throw new AppError(502, `Gemini rechazó la precalificación con estado ${response.status}: ${errText.slice(0, 200)}`);
    }

    const rawJson = (await response.json()) as any;
    const candidates = rawJson.candidates ?? [];
    const textPart = candidates[0]?.content?.parts?.find((p: { text?: string; thought?: boolean }) => !p.thought && p.text)?.text;

    if (!textPart) {
      throw new AppError(502, 'Gemini devolvió una respuesta vacía en el matching');
    }

    let parsedOutput: unknown;
    try {
      parsedOutput = JSON.parse(textPart);
    } catch {
      throw new AppError(502, 'La salida del agente de correspondencia no es un JSON válido');
    }

    const validation = MatcherOutputSchema.safeParse(parsedOutput);
    if (!validation.success) {
      throw new AppError(422, `La salida del evaluador no cumple el contrato Zod: ${JSON.stringify(validation.error.format())}`);
    }

    const { status, confidence, rationale, matches } = validation.data;

    // 3. Regla Anti-Alucinación: Solo se aceptan coincidencias con IDs de evidencias que existan en el dossier entregado
    const validMatches = matches.filter((m) => validDossierIds.has(m.dossierItemId));

    const evidences = validMatches.map((m) => {
      const source = dossierMap.get(m.dossierItemId)!;
      return {
        sourceType: source.sourceType,
        sourceId: source.id,
        sourceTitle: source.title,
        matchType: m.matchType,
        excerpt: m.excerpt,
        confidence: m.confidence,
        validUntil: source.validUntil ? new Date(source.validUntil) : null,
      };
    });

    const isBlocking = requirement.requirementType === 'MANDATORY' && status === 'NOT_SUPPORTED';

    const usage = rawJson.usageMetadata;
    const promptTokens = (usage?.promptTokenCount as number | undefined) ?? 1500;
    const candidateTokens = (usage?.candidatesTokenCount as number | undefined) ?? 200;
    const costMicrounits = calculateGeminiCostMicrounits(promptTokens, candidateTokens);

    return {
      status,
      confidence,
      rationale,
      isBlocking,
      agent: {
        name: 'qualification-matcher-agent',
        model: env.GEMINI_MODEL,
        promptVersion: PromptVersion,
        toolVersion: ToolVersion,
        durationMs: Date.now() - startedAt,
        costMicrounits,
      },
      evidences,
    };
  }
}

export const qualificationMatcherAgent = new QualificationMatcherAgent();
