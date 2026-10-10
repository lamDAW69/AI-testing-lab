import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Comprueba si las variables de entorno de Supabase Auth están configuradas.
 */
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey || typeof supabaseUrl !== 'string') {
    return false;
  }
  return (
    supabaseUrl.startsWith('https://') ||
    supabaseUrl.startsWith('http://localhost') ||
    supabaseUrl.startsWith('http://127.0.0.1')
  );
};

/**
 * Cliente Supabase singleton configurado estrictamente con almacenamiento en memoria
 * para satisfacer la Regla 4.2 de AGENTS.md (Inmunidad contra robo de tokens por XSS).
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: false, // Token en memoria volátil de JS (Cero persistencia en localStorage)
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
