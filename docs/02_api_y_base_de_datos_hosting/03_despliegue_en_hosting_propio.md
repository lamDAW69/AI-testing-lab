# Módulo 02.3 — Despliegue en Hosting Propio (VPS Agnóstico)

En este módulo aprenderás a aprovisionar y asegurar cualquier servidor VPS (Hetzner, DigitalOcean, OVH, Linode, AWS EC2 o servidor local) para ejecutar tu API y base de datos con grado de producción.

---

## 🛡️ Paso 1: Blindaje del Servidor Base (Hardening de Linux)

Al contratar un VPS con Ubuntu 22.04 o 24.04 LTS:

### 1. Crear un usuario sin privilegios y deshabilitar Root por SSH
```bash
# Crear usuario administrador
adduser deployer
usermod -aG sudo deployer

# Configurar claves SSH
mkdir -p /home/deployer/.ssh
cp /root/.ssh/authorized_keys /home/deployer/.ssh/
chown -R deployer:deployer /home/deployer/.ssh
chmod 700 /home/deployer/.ssh
chmod 600 /home/deployer/.ssh/authorized_keys
```

### 2. Configurar Firewall (UFW)
Solo permitiremos tráfico en los puertos indispensables (SSH, HTTP y HTTPS). **PostgreSQL (5432) NUNCA debe estar abierto al público**:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (Para certificados SSL)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 🐳 Paso 2: Instalación de Docker y Docker Compose

```bash
# Instalar dependencias oficiales de Docker
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Permitir al usuario deployer usar Docker sin sudo
sudo usermod -aG docker deployer
```

---

## 🌐 Paso 3: Reverse Proxy con SSL Automático (Caddy)

[Caddy](https://caddyserver.com/) es un servidor web y reverse proxy ultrarrápido escrito en Go que gestiona certificados SSL de Let's Encrypt de forma 100% automática y sin necesidad de configurar cron jobs ni certbot.

### Crear `Caddyfile` en el servidor:
```caddyfile
# Caddyfile
api.tu-dominio.com {
    # Headers de seguridad recomendados
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
    }

    # Proxy inverso apuntando al contenedor de la API (puerto 3000 interno)
    reverse_proxy localhost:3000
}
```

Para correr Caddy mediante Docker:
```yaml
  caddy:
    image: caddy:2-alpine
    container_name: app_caddy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - app_internal_network
```

---

## 🔐 Paso 4: Gestión de Secretos en Producción

1. Crea en el servidor un archivo `.env` en la carpeta del proyecto (`/home/deployer/app/.env`).
2. Dale permisos restrictivos para que nadie salvo el usuario `deployer` pueda leerlo:
   ```bash
   chmod 600 /home/deployer/app/.env
   ```
3. Genera contraseñas criptográficamente aleatorias con `openssl`:
   ```bash
   openssl rand -hex 32
   ```

---

## 🚀 Paso 5: Puesta en Marcha

Para iniciar todo el sistema:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Para verificar logs:
```bash
docker compose logs -f api
docker compose logs -f postgres
```
