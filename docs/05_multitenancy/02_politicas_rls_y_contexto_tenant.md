# Módulo 05.2 — Políticas RLS en PostgreSQL y Contexto de Inquilino

**Row Level Security (RLS)** es una característica nativa de PostgreSQL que actúa como un cortafuegos a nivel de motor de base de datos. 

Incluso si un desarrollador o una IA escribe por error `SELECT * FROM products;` sin la cláusula `WHERE tenant_id = ...`, PostgreSQL **filtrará automáticamente las filas** y solo devolverá las que pertenezcan al inquilino de la sesión actual.

---

## 🛡️ ¿Cómo Funciona RLS con Variables de Sesión?

1. Cuando la API abre o reutiliza una conexión del pool de conexiones para atender una petición, ejecuta:
   ```sql
   SET LOCAL app.current_tenant_id = 'c1b4d8a2-1234-4567-89ab-cdef01234567';
   ```
2. La palabra clave `LOCAL` garantiza que esta variable solo viva durante la duración de la transacción actual.
3. Las políticas de RLS evalúan la fila contra el valor de `current_setting('app.current_tenant_id')`.

---

## 📜 Configuración SQL de RLS

```sql
-- 1. Activar RLS en la tabla de productos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Forzar RLS incluso para el dueño de la tabla (por seguridad extra)
ALTER TABLE products FORCE ROW LEVEL SECURITY;

-- 2. Crear Política para LECTURA (SELECT)
CREATE POLICY tenant_isolation_policy_select ON products
    FOR SELECT
    USING (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    );

-- 3. Crear Política para INSERCIÓN (INSERT)
CREATE POLICY tenant_isolation_policy_insert ON products
    FOR INSERT
    WITH CHECK (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    );

-- 4. Crear Política para ACTUALIZACIÓN (UPDATE)
CREATE POLICY tenant_isolation_policy_update ON products
    FOR UPDATE
    USING (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    )
    WITH CHECK (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    );

-- 5. Crear Política para ELIMINACIÓN (DELETE)
CREATE POLICY tenant_isolation_policy_delete ON products
    FOR DELETE
    USING (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    );
```

---

## ⚡ Implementación en el Pool de Conexiones de la API (TypeScript)

Para ejecutar transacciones con RLS de forma limpia y transparente:

```typescript
// src/db/tenant-transaction.ts
import { Pool, PoolClient } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Ejecuta una operación de base de datos dentro de una transacción
 * protegida por el tenantId en RLS
 */
export async function withTenantContext<T>(
  tenantId: string,
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Inyectar el tenant_id de forma local en la transacción
    // El segundo parámetro ($1) previene inyecciones SQL en la variable
    await client.query('SELECT set_config($1, $2, true)', [
      'app.current_tenant_id',
      tenantId
    ]);

    // Ejecutar la lógica de negocio
    const result = await callback(client);

    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // Liberar la conexión al pool
    client.release();
  }
}
```

---

## 🧪 Demostración Práctica: Prueba de Aislamiento RLS

Supongamos que ejecutamos este código en la API:

```typescript
// Petición del Tenant A
const productos = await withTenantContext(tenantA_ID, async (client) => {
  // Nota que aquí NO pusimos 'WHERE tenant_id = ...'
  const res = await client.query('SELECT name, price_cents FROM products');
  return res.rows;
});
```

**Resultado de PostgreSQL**:
* Aunque la consulta fue `SELECT * FROM products`, PostgreSQL aplicó internamente la política de RLS.
* Solo se devuelven los registros donde `tenant_id == tenantA_ID`.
* Los registros del Tenant B son invisibles, inexistentes para esa transacción.

> [!TIP]
> **Defensa en Profundidad**: Aunque RLS te protege contra descuidos, la regla de oro sigue siendo incluir `WHERE tenant_id = $1` en tus repositorios. De esta forma, el índice `(tenant_id, ...)` optimiza la búsqueda antes de que RLS siquiera tenga que evaluar fila por fila.
