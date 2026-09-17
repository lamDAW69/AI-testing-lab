# Módulo 00.2 — Guía Pedagógica: Cómo Aprender y Construir con IA

Trabajar con asistentes de Inteligencia Artificial (Codex, Cursor, Claude, ChatGPT, Antigravity) puede convertirte en un **ingeniero 10x** o en un **copiador vulnerable**. Esta guía te enseña el método para dominar la primera opción.

---

## 🧠 Los 3 Peligros de Programar con IA a Ciegas

1. **La Ilusión de Comprensión**: Ver que un código funciona no significa que sepas por qué funciona ni qué pasará cuando falle en producción.
2. **El Agujero de Seguridad Oculto**: Las IAs tienden a generar código que "funciona rápido", a menudo olvidando sanitizar entradas, saltándose validaciones de inquilino o usando secretos quemados en el código.
3. **La Deuda Técnica Ingobernable**: Si dejas que la IA cree 20 archivos sin supervisión, cuando aparezca un bug no sabrás dónde mirar.

---

## 🎯 El Método "Aprende-Construye" en 4 Pasos

Cada vez que vayas a pedirle una nueva característica o módulo a la IA, sigue estrictamente este ciclo:

```
    ┌────────────────────────┐
    │  1. CONCEPTUALIZAR     │ ◄── Pregunta a la IA: "¿Por qué se hace así?"
    └───────────┬────────────┘
                │
                ▼
    ┌────────────────────────┐
    │  2. REVISAR EL CONTRATO│ ◄── Define tipos, esquemas Zod/Pydantic
    └───────────┬────────────┘
                │
                ▼
    ┌────────────────────────┐
    │  3. CODIFICAR GUIADO   │ ◄── La IA escribe, tú lees cada línea
    └───────────┬────────────┘
                │
                ▼
    ┌────────────────────────┐
    │  4. INTENTO DE HACKEO  │ ◄── Ejecuta pruebas de bypass y BOLA
    └────────────────────────┘
```

### Paso 1: Conceptualizar (Antes de escribir código)
No pidas: *"Hazme un endpoint para crear facturas"*.
Pide en su lugar:
> *"Quiero crear un endpoint para crear facturas. Antes de escribir el código, explícame: ¿qué datos mínimos necesitamos?, ¿cómo garantizamos que pertenezca al `tenant_id` actual?, y ¿qué validaciones de seguridad debemos aplicar?"*

### Paso 2: Revisar el Contrato (Tipos y Esquemas)
Obliga a la IA a definir primero los tipos de datos y esquemas de validación (usando Zod o Pydantic). Si el esquema de datos está bien diseñado, el 80% de los errores desaparecen antes de compilar.

### Paso 3: Codificación Guiada y Explicada
Gracias a las directivas de [`AGENTS.md`](../../AGENTS.md), la IA está obligada a incluir comentarios explicativos en los bloques críticos (manejo de transacciones, inyección de contexto, verificación de JWT). Léelos detenidamente.

### Paso 4: El Test del "Hacker Malicioso"
Una vez que el endpoint funcione para el caso correcto ("camino feliz"), hazle a la IA esta pregunta clave:
> *"Ahora escribe un test donde un usuario malicioso del Tenant A intente obtener la factura del Tenant B cambiando el ID. Demuéstrame que el servidor le responde 404 o 403 y no filtra datos."*

---

## 💡 Prompts Clave para Exprimir al Máximo a la IA

Copia y utiliza estas fórmulas cuando estés desarrollando:

| Situación | Prompt Recomendado |
| :--- | :--- |
| **Duda conceptual** | *"Explícame como si fuera un estudiante universitario de informática qué diferencia hay entre autenticación asimétrica con JWKS y simétrica con HMAC secreto."* |
| **Revisión de Seguridad** | *"Revisa este archivo que acabamos de escribir. ¿Tiene alguna vulnerabilidad según el OWASP API Top 10? Específicamente revisa si hay vectores de BOLA o inyección SQL."* |
| **Optimización de BD** | *"¿Qué índice compuesto de PostgreSQL deberíamos crear para esta consulta y por qué el orden de las columnas en el índice importa?"* |
| **Explicación de Errores** | *"Ha fallado este comando/test con este error: `[pega el error]`. No te limites a darme el código arreglado, explícame la causa raíz del error."* |
