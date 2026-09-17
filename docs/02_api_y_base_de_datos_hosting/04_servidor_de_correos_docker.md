# Módulo 02.4 — Servidor de Correos Contenerizado (Mail Server)

En este módulo aprenderás a implementar y montar un **servidor de correo electrónico seguro y contenerizado con Docker**, tanto para pruebas locales sin envíos reales (**Mailpit**) como para producción en tu VPS propio (**Docker Mailserver**), integrándolo con **Supabase Auth** y tu **API Backend**.

---

## 🎯 1. Concepto y Rationale (Aprender)

### ¿Por qué montar un servidor de correos propio?
1. **Límites estrictos en Supabase Auth**: Por defecto, la capa gratuita de Supabase Auth limita el envío de correos a un máximo de **3 emails por hora**. En cuanto un nuevo usuario intente registrarse o recuperar contraseña, el servicio fallará si se supera este cupo. Configurar un servidor SMTP propio elimina esta restricción por completo.
2. **Costes e independencia de terceros**: Los servicios SaaS de email transaccional (Resend, SendGrid, Mailgun, AWS SES) cobran por volumen y pueden suspender cuentas ante fluctuaciones repentinas de tráfico. Un servidor en tu propio VPS tiene **coste marginal cero** y soberanía total sobre los datos (estricto cumplimiento GDPR/LOPD).
3. **Control multi-tenant**: Tu backend puede enviar notificaciones, facturas y alertas con branding personalizado por cada inquilino de tu plataforma.

### La estrategia de doble entorno:
* **Entorno de Desarrollo (Local)**: Usar un servidor real en `localhost` es inviable (no dispones de IP pública estática ni registros DNS válidos). Usaremos **Mailpit**: un servidor SMTP ligero que intercepta todos los correos entrantes y te permite visualizarlos en una interfaz web, garantizando que **ningún correo de prueba llegue por error a usuarios reales**.
* **Entorno de Producción (VPS)**: Usaremos **Docker Mailserver (`docker-mailserver`)**, el estándar de facto para correo contenerizado en Linux: empaqueta Postfix (SMTP), Dovecot (IMAP/LMTP), OpenDKIM (firmado criptográfico), Fail2ban (anti fuerza bruta) y soporte TLS en una sola imagen endurecida.

---

## 🛠️ 2. Entorno de Desarrollo Local: Mailpit

[Mailpit](https://github.com/axllent/mailpit) es un emulador SMTP ultrarrápido con interfaz web inspirada en los clientes de correo modernos.

### Añadir Mailpit a `docker-compose.yml` (Local):
```yaml
services:
  # ... otros servicios (postgres, api) ...

  mailpit:
    image: axllent/mailpit:latest
    container_name: app_mailpit
    restart: unless-stopped
    ports:
      - "127.0.0.1:1025:1025" # Puerto SMTP para enviar correos desde la API o Supabase local
      - "127.0.0.1:8025:8025" # Web UI para inspeccionar correos en el navegador
    environment:
      MP_MAX_MESSAGES: 500
      MP_SMTP_AUTH_ACCEPT_ANY: 1 # Acepta cualquier usuario/contraseña en desarrollo
    networks:
      - app_internal_network
```

> [!TIP]
> En desarrollo, configura la API para enviar correos a `localhost:1025` (sin cifrado TLS obligatorio ni credenciales reales) y abre `http://localhost:8025` en tu navegador para ver los emails renderizados con sus enlaces de confirmación y tokens.

---

## 🚀 3. Entorno de Producción: Docker Mailserver

En tu VPS, aislaremos el servidor de correo en su propio archivo de orquestación `docker-compose.mail.yml` o integrado en el compose de producción.

### `docker-compose.mail.yml`:
```yaml
version: '3.8'

services:
  mailserver:
    image: ghcr.io/docker-mailserver/docker-mailserver:latest
    container_name: mailserver
    hostname: mail
    domainname: tu-dominio.com
    # FQDN resultante: mail.tu-dominio.com
    restart: always
    ports:
      - "25:25"     # SMTP entrante (servidor a servidor)
      - "465:465"   # SMTPS (Implicit TLS)
      - "587:587"   # Submission (STARTTLS - recomendado para clientes/API)
      - "993:993"   # IMAPS (para leer buzones si es necesario)
    environment:
      - OVERRIDE_HOSTNAME=mail.tu-dominio.com
      - LOG_LEVEL=info
      - ONE_DIR=1
      # Autenticación y Seguridad
      - ENABLE_FAIL2BAN=1
      - ENABLE_POSTGREY=0
      - ENABLE_CLAMAV=0          # Poner en 1 solo si tu VPS tiene >= 4GB de RAM
      - ENABLE_SPAMASSASSIN=1
      - SPAMASSASSIN_SPAM_TO_INBOX=1
      - ENABLE_MANAGESIEVE=0
      # Configuración TLS
      - SSL_TYPE=letsencrypt
      - SSL_CERT_PATH=/etc/letsencrypt/live/mail.tu-dominio.com/fullchain.pem
      - SSL_KEY_PATH=/etc/letsencrypt/live/mail.tu-dominio.com/privkey.pem
    cap_add:
      - NET_ADMIN # Requerido por Fail2ban para bloquear IPs atacantes con iptables
    volumes:
      - mail_data:/var/mail
      - mail_state:/var/mail-state
      - mail_logs:/var/log/mail
      - mail_config:/tmp/docker-mailserver
      - /etc/letsencrypt:/etc/letsencrypt:ro # Certificados SSL del VPS (Caddy o Certbot)
    networks:
      - mail_network

volumes:
  mail_data:
    driver: local
  mail_state:
    driver: local
  mail_logs:
    driver: local
  mail_config:
    driver: local

networks:
  mail_network:
    driver: bridge
```

### Comandos de Administración de Cuentas (CLI):

Docker Mailserver incluye un script de ayuda llamado `setup` para gestionar usuarios y certificados sin tocar ficheros a mano:

```bash
# 1. Iniciar el contenedor de correo
docker compose -f docker-compose.mail.yml up -d

# 2. Crear una cuenta de correo para notificaciones automáticas (noreply)
docker compose -f docker-compose.mail.yml exec mailserver setup email add noreply@tu-dominio.com "UnaContrasenaMuySeguraGenerada123!"

# 3. Crear una cuenta de soporte o administración
docker compose -f docker-compose.mail.yml exec mailserver setup email add contacto@tu-dominio.com "OtraContrasenaMuySegura456!"

# 4. Generar las claves criptográficas DKIM (DomainKeys Identified Mail)
docker compose -f docker-compose.mail.yml exec mailserver setup config dkim keysize 2048
```

---

## 🛡️ 4. Entregabilidad y Seguridad DNS (Evitar caer en SPAM)

El mayor desafío de un servidor de correo autohospedado no es levantarlo, sino lograr que **Gmail, Outlook y Yahoo confíen en tus correos**. Para ello, debes configurar obligatoriamente estos 5 registros en tu proveedor de DNS (Cloudflare, Hetzner DNS, etc.):

### Tabla de Registros DNS Obligatorios:

| Tipo | Nombre (Host) | Valor | Propósito |
| :--- | :--- | :--- | :--- |
| **A** | `mail` | `198.51.100.25` (IP pública de tu VPS) | Apunta el subdominio del servidor de correo |
| **MX** | `@` (raíz) | `mail.tu-dominio.com` (Prioridad: `10`) | Le dice a internet qué servidor recibe correos para tu dominio |
| **TXT** | `@` | `v=spf1 mx ip4:198.51.100.25 -all` | **SPF**: Declara que solo tu VPS tiene permiso de enviar emails desde este dominio |
| **TXT** | `mail._domainkey` | `v=DKIM1; k=rsa; p=MIIBIjANBgkqh...` (Clave pública generada por `setup config dkim`) | **DKIM**: Firma digitalmente cada correo para garantizar que no fue modificado en tránsito |
| **TXT** | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:postmaster@tu-dominio.com; pct=100; adkim=s; aspf=s` | **DMARC**: Política que indica a los receptores qué hacer si fallan SPF o DKIM |

#### Cómo ver la clave pública DKIM generada:
```bash
cat /tmp/docker-mailserver/opendkim/keys/tu-dominio.com/mail.txt
```
Copia el contenido del registro TXT y pégalo en tu panel DNS en el nombre `mail._domainkey`.

### El Registro PTR (Reverse DNS / rDNS) — ¡Punto Crítico!
> [!CAUTION]
> Si no configuras el **Reverse DNS**, el 99% de tus correos serán rechazados inmediatamente por Gmail y Microsoft.
> 
> - **Qué es**: Cuando un receptor recibe un email de `198.51.100.25`, hace una consulta inversa: *"¿A qué dominio pertenece esta IP?"*.
> - **Mandato**: Debes ingresar al panel de control de tu proveedor de VPS (Hetzner Cloud Console, DigitalOcean Networking, OVH Manager) y asignar el Reverse DNS de tu IP a: `mail.tu-dominio.com`.

### Advertencia sobre el Puerto 25 en Proveedores Cloud:
La gran mayoría de proveedores de hosting (Hetzner, DigitalOcean, Linode, AWS) **bloquean por defecto el puerto 25 saliente** para evitar que atacantes creen cuentas nuevas para enviar spam.
- **Solución**: Abre un ticket de soporte con tu proveedor solicitando la apertura del puerto 25 saliente para un servidor de correo transaccional legítimo (suelen pedir tu dominio y que tengas el rDNS configurado).
- **Alternativa si no abren el puerto 25**: Configura `docker-mailserver` con un **Relay Host** (usando el puerto 587 autenticado).

---

## 🔗 5. Integración con Supabase Auth (Custom SMTP)

Una vez que tu servidor esté corriendo y los registros DNS estén validados:

1. Ve a tu panel de Supabase: `https://supabase.com/dashboard/project/<tu-proyecto-ref>/settings/auth`.
2. Busca la sección **SMTP Settings** y activa **"Enable Custom SMTP"**.
3. Rellena los datos con las credenciales de tu contenedor:
   - **Sender Email**: `noreply@tu-dominio.com`
   - **Sender Name**: `Tu Plataforma SaaS`
   - **Host**: `mail.tu-dominio.com`
   - **Port**: `587`
   - **Encryption**: `STARTTLS` (o `465` con `SSL`)
   - **Username**: `noreply@tu-dominio.com`
   - **Password**: `UnaContrasenaMuySeguraGenerada123!`
4. Haz clic en **"Save"**. A partir de ese momento, los emails de confirmación de registro y restablecimiento de contraseña saldrán por tu propio servidor sin ningún límite por hora.

---

## 💻 6. Integración en la API Backend (TypeScript + Nodemailer + Zod)

Para enviar correos de negocio desde la API (bienvenidas a nuevos inquilinos, avisos de facturación, invitaciones de equipo), implementaremos un servicio seguro con validación estricta para evitar **Email Header Injection**.

### 1. Esquema de Validación con Zod (`email.schema.ts`):
```typescript
import { z } from 'zod';

// Previene inyecciones de saltos de línea (\r\n) que atacantes usan para inyectar cabeceras 'Bcc' o 'Subject'
const safeStringSchema = z.string().refine(val => !/[\r\n]/.test(val), {
  message: 'No se permiten caracteres de nueva línea en cabeceras de correo',
});

export const SendEmailSchema = z.object({
  tenantId: z.string().uuid(),
  to: z.string().email('Dirección de correo inválida'),
  subject: safeStringSchema.min(1).max(200),
  htmlContent: z.string().min(1),
  replyTo: z.string().email().optional(),
}).strict();

export type SendEmailInput = z.infer<typeof SendEmailSchema>;
```

### 2. Servicio de Correo Tipado (`email.service.ts`):
```typescript
import nodemailer, { Transporter } from 'nodemailer';
import { SendEmailInput } from './email.schema';

class MailService {
  private transporter: Transporter;

  constructor() {
    // Configuración con variables de entorno validadas
    const isProduction = process.env.NODE_ENV === 'production';

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || (isProduction ? 'mail.tu-dominio.com' : 'localhost'),
      port: Number(process.env.SMTP_PORT) || (isProduction ? 587 : 1025),
      secure: process.env.SMTP_PORT === '465', // true para 465, false para otros puertos
      auth: isProduction
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined, // Mailpit en local no requiere autenticación
    });
  }

  /**
   * Envía un correo con aislamiento y trazabilidad multi-inquilino
   */
  async sendTransactionalEmail(input: SendEmailInput): Promise<{ messageId: string }> {
    const fromAddress = process.env.SMTP_FROM || 'noreply@tu-dominio.com';

    // Cabeceras de trazabilidad para auditar a qué inquilino corresponde cada envío
    const info = await this.transporter.sendMail({
      from: `"Tu Plataforma" <${fromAddress}>`,
      to: input.to,
      subject: input.subject,
      html: input.htmlContent,
      replyTo: input.replyTo,
      headers: {
        'X-Tenant-ID': input.tenantId, // Auditoría interna anti-abuso
      },
    });

    return { messageId: info.messageId };
  }
}

export const mailService = new MailService();
```

---

## 🧪 7. Verificación y Pruebas

### 1. Probar el servidor localmente con Mailpit:
Levanta el contenedor de desarrollo y envía un correo con `curl` o mediante tu API:
```bash
docker compose up -d mailpit
```
Abre `http://localhost:8025` y verás el correo recibido al instante.

### 2. Probar el servidor de producción con `swaks` (Swiss Army Knife for SMTP):
Desde tu máquina local o desde el servidor, puedes probar el flujo SMTP completo y TLS con una sola línea:

```bash
# Instalar swaks (en Linux/macOS)
# sudo apt install swaks || brew install swaks

swaks --to prueba@tucorreo-personal.com \
      --from noreply@tu-dominio.com \
      --server mail.tu-dominio.com:587 \
      --auth LOGIN \
      --auth-user noreply@tu-dominio.com \
      --auth-password "UnaContrasenaMuySeguraGenerada123!" \
      -tls
```

### 3. Test de Reputación y Entregabilidad (Puntuación 10/10):
1. Entra en [mail-tester.com](https://www.mail-tester.com).
2. Te dará una dirección de correo temporal (ej: `test-xyz123@srv1.mail-tester.com`).
3. Envía un correo a esa dirección desde tu servidor.
4. Pulsa en **"Comprobar puntuación"**.
5. Mail-tester analizará tu **SPF**, **DKIM**, **DMARC**, **Reverse DNS (PTR)** y formato del email. Si seguiste todos los pasos de este módulo, obtendrás un **10/10 impecable**.

---

## 🎓 Resumen Pedagógico:
1. **Separación de entornos**: Mailpit en desarrollo local evita enviar spam o fugar datos de clientes durante los tests.
2. **Higiene Criptográfica (DKIM & SPF)**: Ningún servidor de correo moderno confía en un remitente sin firmas asimétricas y registros TXT alineados.
3. **Control Total**: Al desacoplar el correo de proveedores externos y de los límites de Supabase, tu arquitectura se vuelve autónoma, económica y de nivel empresarial.
