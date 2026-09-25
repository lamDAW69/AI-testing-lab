import { z } from 'zod';
import dotenv from 'dotenv';

// Carga las variables de entorno desde .env si existe
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es obligatoria'),
  ADMIN_DATABASE_URL: z.string().min(1).optional(),
  SUPABASE_PROJECT_URL: z
    .string()
    .url('SUPABASE_PROJECT_URL debe ser una URL válida')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  INGEST_SECRET: z.string().min(8).optional().default('dev_ingest_secret_change_in_prod'),
  // Volumen local aislado: los binarios no se sirven directamente desde la API.
  DOCUMENT_STORAGE_DIR: z.string().min(1).default('/app/data/documents'),
  // Una clave ausente o vacía desactiva Gemini, pero nunca debe impedir que
  // arranque el resto de la API. El extractor devuelve 503 hasta configurarla.
  GEMINI_API_KEY: z.string().min(20).optional().or(z.literal('').transform(() => undefined)),
  GEMINI_MODEL: z.string().min(1).default('gemini-3.1-flash-lite'),
  GEMINI_MAX_DOCUMENT_CHARS: z.coerce.number().int().min(1_000).max(1_000_000).default(250_000),
  GEMINI_MAX_OUTPUT_TOKENS: z.coerce.number().int().min(256).max(16_384).default(8_000),
  GEMINI_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(120_000).default(45_000),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Error crítico: Configuración de variables de entorno inválida:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
