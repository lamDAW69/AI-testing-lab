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
