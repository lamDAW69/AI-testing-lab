# Módulo 04.1 — Blindaje Defensivo contra BOLA / IDOR

**BOLA (Broken Object Level Authorization)**, también conocido tradicionalmente como **IDOR (Insecure Direct Object Reference)**, es la vulnerabilidad **#1 en el ranking OWASP API Security Top 10**.

En este módulo aprenderás exactamente qué es, cómo los atacantes la explotan y las reglas matemáticas y de código para erradicarla para siempre en tu proyecto multi-tenant.

---

## 💥 ¿Qué es un ataque BOLA y cómo ocurre?

Imagina un sistema de facturación o gestión de pedidos:
1. El usuario **Juan** pertenece a la **Empresa A** (`tenant_id: "aaa-111"`).
2. Juan abre el panel y ve su factura número 42:
   `GET /api/invoices/42`
3. Juan abre las herramientas de desarrollador del navegador (o Postman) y cambia el número en la URL a 43:
   `GET /api/invoices/43`
4. Si la factura 43 pertenece a la **Empresa B** (`tenant_id: "bbb-222"`) y el servidor le devuelve los datos de la factura 43 a Juan, **ha ocurrido un ataque BOLA exitoso**.

> [!CAUTION]
> **El gran error de los desarrolladores novatos**:
> Creer que porque el usuario está autenticado (`req.user` existe) ya está autorizado a ver cualquier objeto que pida por su ID. La autenticación solo comprueba *quién eres*, la autorización comprueba *si tienes permiso sobre este objeto específico*.

---

## ❌ Ejemplo de Código VULNERABLE a BOLA

```typescript
// ❌ CÓDIGO PELIGROSO - VULNERABLE A BOLA
app.get('/api/invoices/:id', authMiddleware, async (req, res) => {
  const invoiceId = req.params.id;

  // ⚠️ ERROR FATAL: Solo busca por ID primario. 
  // No valida si la factura pertenece al tenant del usuario autenticado.
  const invoice = await db.query('SELECT * FROM invoices WHERE id = $1', [invoiceId]);

  if (!invoice.rows[0]) {
    return res.status(404).json({ error: 'Factura no encontrada' });
  }

  // Se devuelven los datos aunque pertenezcan a OTRA empresa
  res.json(invoice.rows[0]);
});
```

---

## ✅ Ejemplo de Código BLINDADO contra BOLA

```typescript
// ✅ CÓDIGO BLINDADO (Anti-BOLA y Multi-Tenant Seguro)
app.get('/api/invoices/:id', authMiddleware, async (req, res) => {
  const invoiceId = req.params.id;
  // Obtenemos el tenantId inyectado por el middleware criptográfico
  const tenantId = req.user!.tenantId;

  // Validar formato UUID antes de consultar la BD
  if (!isValidUUID(invoiceId)) {
    return res.status(400).json({ error: 'Identificador de factura no válido' });
  }

  // 🛡️ REGLA DE ORO: La cláusula WHERE SIEMPRE incluye tenant_id
  const result = await db.query(
    'SELECT * FROM invoices WHERE id = $1 AND tenant_id = $2',
    [invoiceId, tenantId]
  );

  const invoice = result.rows[0];

  if (!invoice) {
    // Respondemos 404 Not Found tanto si la factura no existe
    // como si pertenece a otro tenant (para no confirmar la existencia de recursos ajenos)
    return res.status(404).json({ error: 'Factura no encontrada' });
  }

  res.json(invoice);
});
```

---

## 🛡️ Las 4 Reglas de Blindaje Anti-BOLA

### 1. El Principio del Filtro Compuesto Obligatorio
Toda sentencia `SELECT`, `UPDATE` o `DELETE` sobre cualquier recurso de negocio debe incluir **ineludiblemente**:
```sql
WHERE id = $1 AND tenant_id = $2
```
Si un atacante intenta editar o borrar un ID de otra empresa:
```sql
UPDATE invoices SET status = 'cancelled' WHERE id = 'id-ajeno' AND tenant_id = 'mi-tenant';
```
PostgreSQL modificará **0 filas**. El ataque queda neutralizado silenciosamente.

### 2. Uso de Identificadores Criptográficos (UUIDv7 / ULID)
- Los IDs enteros autoincrementales (`1, 2, 3, 4...`) facilitan a los atacantes raspar (*scraping*) toda tu base de datos mediante bucles automatizados.
- Los **UUIDv7** son números aleatorios de 128 bits prácticamente imposibles de adivinar, pero ordenables cronológicamente (lo que mantiene los índices de PostgreSQL ultrarrápidos).

### 3. Respuestas 404 en lugar de 403 en Recursos Ajenos
Si respondes `403 Forbidden` cuando un usuario pide un recurso de otra empresa, le estás confirmando que el recurso *sí existe* pero no tiene permiso. Esto permite enumeración de recursos. Al responder siempre `404 Not Found`, el atacante no obtiene ninguna información.

### 4. Tests Automatizados de Fuga de Inquilino (Obligatorios)
Para cada endpoint, debes crear un test que simule el ataque:

```typescript
// tests/invoices.security.test.ts
test('Tenant A no puede leer facturas del Tenant B', async () => {
  // 1. Crear factura perteneciente a Tenant B
  const invoiceTenantB = await createTestInvoice({ tenantId: 'tenant-B-uuid' });

  // 2. Intentar leerla usando el token de autenticación del Tenant A
  const response = await request(app)
    .get(`/api/invoices/${invoiceTenantB.id}`)
    .set('Authorization', `Bearer ${tokenTenantA}`);

  // 3. Debe responder 404 Not Found
  expect(response.status).toBe(404);
  expect(response.body.data).toBeUndefined();
});
```
