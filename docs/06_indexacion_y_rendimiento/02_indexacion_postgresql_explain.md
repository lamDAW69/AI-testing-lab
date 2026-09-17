# Módulo 06.2 — Indexación en PostgreSQL y Diagnóstico con EXPLAIN ANALYZE

El segundo pilar fundamental de la indexación es la **indexación en base de datos**: la técnica mediante la cual el motor relacional encuentra un registro entre 10 millones de filas en 1 milisegundo en lugar de tardar 10 segundos leyendo el disco entero.

---

## 💥 El Peligro del "Sequential Scan" (Escaneo Secuencial)

Imagina una tabla `orders` con 1,000,000 de filas distribuidas entre 100 empresas.
Si ejecutas:
```sql
SELECT * FROM orders WHERE tenant_id = 'c1b4d8a2...' AND status = 'pending';
```
* **Sin índice**: PostgreSQL debe leer del disco cada una de las 1,000,000 de filas una por una (*Sequential Scan*). Tu CPU subirá al 100% y la base de datos colapsará con solo 20 usuarios simultáneos.
* **Con índice compuesto B-Tree**: PostgreSQL salta directamente al nodo del árbol que corresponde al `tenant_id` y extrae solo las filas relevantes en 0.4 milisegundos (*Index Scan*).

---

## 🌲 Tipos de Índices en PostgreSQL

| Tipo de Índice | Cuándo Usarlo | Ejemplo |
| :--- | :--- | :--- |
| **B-Tree (Por Defecto)** | Igualdad (`=`), rangos (`<, >, BETWEEN`), ordenación (`ORDER BY`). Es el 95% de los índices que crearás. | `CREATE INDEX idx_tenant_date ON orders(tenant_id, created_at DESC);` |
| **GIN (Generalized Inverted Index)** | Búsquedas de texto completo (*Full-Text Search*), arrays, columnas `JSONB`. | `CREATE INDEX idx_products_tags ON products USING GIN(tags);` |
| **Parcial (Partial Index)** | Filtrar solo un subconjunto de filas frecuentes para ahorrar espacio en disco y memoria RAM. | `CREATE INDEX idx_pending_orders ON orders(tenant_id) WHERE status = 'pending';` |

---

## 🎯 La Regla de Oro: Índices Compuestos Multi-Tenant

> [!IMPORTANT]
> En un sistema multi-tenant, **el orden de las columnas en el índice importa radicalmente**:
> `(columna_A, columna_B)` NO es lo mismo que `(columna_B, columna_A)`.

### El Orden Correcto:
```sql
-- CORRECTO: El tenant_id va de PRIMERO (Leading Column)
CREATE INDEX idx_orders_tenant_status_date ON orders (tenant_id, status, created_at DESC);
```

**Por qué**:
1. Toda consulta incluye `WHERE tenant_id = $1`. Al ponerlo primero, PostgreSQL descarta el 99% de las filas de los demás clientes en el primer paso del árbol.
2. Luego, dentro de los registros de ese cliente, filtra instantáneamente por `status = 'pending'`.
3. Por último, los registros ya están pre-ordenados en memoria por `created_at DESC`, eliminando la necesidad de un costoso ordenamiento en memoria (*Sort operation*).

---

## 🔍 Cómo Leer un `EXPLAIN ANALYZE`

PostgreSQL te permite ver qué hace el planificador de consultas antes de ejecutar una query.

### Ejemplo 1: Consulta Mala (Sin índice)
```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE tenant_id = 'c1b4d8a2-1234...' AND status = 'pending';
```

**Salida en consola**:
```text
Seq Scan on orders  (cost=0.00..18420.00 rows=45 width=248) (actual time=84.120..142.350 rows=12 loops=1)
  Filter: ((status = 'pending'::text) AND (tenant_id = 'c1b4d8a2-1234...'::uuid))
  Rows Removed by Filter: 999988
Execution Time: 142.412 ms  <-- ⚠️ LENTO: Leyó 1 millón de filas para quedarse con 12
```

### Ejemplo 2: Consulta Optimizada (Con índice compuesto)
Creamos el índice:
```sql
CREATE INDEX idx_orders_tenant_status ON orders (tenant_id, status);
```
Volvemos a ejecutar `EXPLAIN ANALYZE`:

**Salida en consola**:
```text
Bitmap Heap Scan on orders  (cost=4.36..18.20 rows=45 width=248) (actual time=0.045..0.068 rows=12 loops=1)
  Recheck Cond: ((tenant_id = 'c1b4d8a2-1234...'::uuid) AND (status = 'pending'::text))
  ->  Bitmap Index Scan on idx_orders_tenant_status  (cost=0.00..4.35 rows=45 width=0) (actual time=0.032..0.032 rows=12 loops=1)
Execution Time: 0.089 ms  <-- 🚀 ULTRA RÁPIDO: De 142 ms bajó a 0.08 ms (1600x más rápido)
```

---

## 🎓 Resumen para el Desarrollador:

1. Nunca dejes una clave foránea sin índice: siempre indexa `tenant_id` y cualquier relación `user_id`.
2. Si una vista de tu aplicación muestra elementos ordenados por fecha o filtrados por estado, crea un índice compuesto que incluya esas columnas en el orden del filtro.
3. Si una consulta tarda más de 50 ms en desarrollo, corre `EXPLAIN ANALYZE` y busca la palabra `Seq Scan`. Si la ves, falta un índice.
