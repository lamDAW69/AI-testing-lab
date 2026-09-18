import { createApp } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/client.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 API en ejecución en modo [${env.NODE_ENV}] sobre el puerto ${env.PORT}`);
  console.log(`📡 Health check disponible en http://localhost:${env.PORT}/health`);
});

// Cierre ordenado (Graceful Shutdown) para evitar pérdida de datos en despliegues Docker
const handleShutdown = async (signal: string) => {
  console.log(`\n🛑 Recibida señal ${signal}. Iniciando cierre ordenado...`);

  server.close(async () => {
    console.log('🔒 Servidor HTTP cerrado. No se aceptan nuevas conexiones.');
    try {
      await pool.end();
      console.log('📦 Pool de conexiones de PostgreSQL cerrado.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error al cerrar el pool de PostgreSQL:', err);
      process.exit(1);
    }
  });

  // Forzar apagado si las conexiones no cierran en 10 segundos
  setTimeout(() => {
    console.error('⚠️ Apagado forzado tras 10 segundos de espera.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
