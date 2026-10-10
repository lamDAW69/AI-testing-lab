import { test, expect } from '@playwright/test';

test.describe('Deferred Onboarding, Multi-Tenant Auto-Provisioning y Resiliencia SMTP', () => {

  test('Escenario 1: Flujo completo de Onboarding Diferido con confirmación de correo y autoprovisión', async ({ page }) => {
    // Regla 12.3 AGENTS.md: Emular navegador real deshabilitando el flag automático navigator.webdriver
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { configurable: true, get: () => undefined });
    });

    let interceptedSignUpBody: any = null;
    let interceptedTenantProvisionBody: any = null;

    // 1. Interceptar llamada de registro en Supabase Auth (POST /auth/v1/signup*)
    await page.route('**/auth/v1/signup*', async (route) => {
      interceptedSignUpBody = route.request().postDataJSON();
      // Simular Supabase Auth con confirmación de email obligatoria: devuelve usuario sin sesión activa
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '11111111-2222-3333-4444-555555555555',
          aud: 'authenticated',
          role: 'authenticated',
          email: 'elena@novatech-solutions.com',
          email_confirmed_at: null,
          user_metadata: {
            full_name: 'Elena Martínez',
            company_name: 'NovaTech Solutions S.L.',
            tax_id: 'B-99887766',
            cpv_sector: '72000000',
          },
          identities: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          session: null,
        }),
      });
    });

    // 2. Navegar a la ruta canónica de registro (/signup por Regla 12.1 AGENTS.md)
    await page.goto('/signup');
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.locator('h1')).toContainText('Crear cuenta corporativa');

    // 3. Rellenar formulario de registro con datos del operador y de la empresa mercantil
    await page.fill('input[placeholder="Carlos Gómez"]', 'Elena Martínez');
    await page.fill('input[placeholder="carlos@empresa.es"]', 'elena@novatech-solutions.com');
    await page.fill('input[placeholder="Mínimo 8 caracteres"]', 'SuperClave2026!');
    await page.fill('input[placeholder="InnovaTech Consultoría S.L."]', 'NovaTech Solutions S.L.');
    await page.fill('input[placeholder="B-12345678"]', 'B-99887766');

    // 4. Enviar formulario
    await page.click('button[type="submit"]');

    // 5. Verificar que options.data en Supabase Auth retiene los metadatos corporativos para el onboarding diferido
    await expect.poll(() => interceptedSignUpBody).not.toBeNull();
    expect(interceptedSignUpBody.email).toBe('elena@novatech-solutions.com');
    expect(interceptedSignUpBody.data?.full_name).toBe('Elena Martínez');
    expect(interceptedSignUpBody.data?.company_name).toBe('NovaTech Solutions S.L.');
    expect(interceptedSignUpBody.data?.tax_id).toBe('B-99887766');
    expect(interceptedSignUpBody.data?.cpv_sector).toBe('72000000');

    // 6. Verificar mensaje explicativo de confirmación pendiente y cooldown de 60 segundos
    await expect(page.getByText('Revisa tu correo y confírmalo')).toBeVisible();
    await expect(page.getByText(/La organización se provisionará de forma segura al iniciar sesión por primera vez/)).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.locator('button[type="submit"]')).toContainText(/Reintentar en \d+s/);

    // 7. Simular flujo post-verificación de email: Primer inicio de sesión
    // Interceptar login en Supabase Auth (POST /auth/v1/token*)
    await page.route('**/auth/v1/token*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'verified-test-jwt-token-2026',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'verified-refresh-token-2026',
          user: {
            id: '11111111-2222-3333-4444-555555555555',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'elena@novatech-solutions.com',
            email_confirmed_at: new Date().toISOString(),
            user_metadata: {
              full_name: 'Elena Martínez',
              company_name: 'NovaTech Solutions S.L.',
              tax_id: 'B-99887766',
              cpv_sector: '72000000',
            },
          },
        }),
      });
    });

    // Interceptar GET /api/onboarding/membership devolviendo 200 con pendingOnboarding: true (Cero 403 Forbidden)
    let membershipQueryReceived = false;
    await page.route('**/api/onboarding/membership*', async (route) => {
      membershipQueryReceived = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: null,
          pendingOnboarding: true,
          message: 'Usuario autenticado sin organización vinculada.',
        }),
      });
    });

    // Interceptar POST /api/onboarding/tenant autoprovisionando la organización mercantil
    await page.route('**/api/onboarding/tenant*', async (route) => {
      interceptedTenantProvisionBody = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            tenantId: '99999999-8888-7777-6666-555555555555',
            name: 'NovaTech Solutions S.L.',
            taxId: 'B-99887766',
            role: 'owner',
            created: true,
          },
        }),
      });
    });

    // Mock de rutas secundarias del dashboard para carga limpia de /app/inicio
    await page.route('**/api/portfolio**', (route) => route.fulfill({ json: [] }));
    await page.route('**/api/alerts**', (route) => route.fulfill({ json: [] }));
    await page.route('**/api/dossier/**', (route) => route.fulfill({ json: {} }));
    await page.route('**/api/public/**', (route) => route.fulfill({ json: [] }));

    // 8. Navegar a /login e iniciar sesión con las credenciales verificadas
    await page.goto('/login');
    await page.fill('input[type="email"]', 'elena@novatech-solutions.com');
    await page.fill('input[type="password"]', 'SuperClave2026!');
    await page.click('button[type="submit"]');

    // 9. Verificar aterrizaje suave en /app/inicio con tenant activo vinculado y sin errores 403
    await expect(page).toHaveURL(/\/app\/inicio/);
    expect(membershipQueryReceived).toBe(true);
    await expect.poll(() => interceptedTenantProvisionBody).not.toBeNull();
    expect(interceptedTenantProvisionBody.legalName).toBe('NovaTech Solutions S.L.');
    expect(interceptedTenantProvisionBody.taxId).toBe('B-99887766');

    // 10. Verificar presencia de la organización en la interfaz y rol Administrador/Owner
    await expect(page.getByText('NovaTech Solutions S.L.').first()).toBeVisible();
    await expect(page.getByText('Elena Martínez').first()).toBeVisible();
    await expect(page.getByText('Modo Demo')).not.toBeVisible();
  });

  test('Escenario 2: Resiliencia ante límites de frecuencia HTTP 429 y cuotas GoTrue', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { configurable: true, get: () => undefined });
    });

    // Interceptar registro con status 429 y código over_email_send_rate_limit de Supabase
    await page.route('**/auth/v1/signup*', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'over_email_send_rate_limit',
          message: 'Email rate limit exceeded',
        }),
      });
    });

    await page.goto('/signup');

    await page.fill('input[placeholder="Carlos Gómez"]', 'Carlos Gómez');
    await page.fill('input[placeholder="carlos@empresa.es"]', 'carlos.rate@empresa.es');
    await page.fill('input[placeholder="Mínimo 8 caracteres"]', 'SuperSegura2026!');
    await page.fill('input[placeholder="InnovaTech Consultoría S.L."]', 'Pruebas Frecuencia S.L.');
    await page.fill('input[placeholder="B-12345678"]', 'B-11223344');

    await page.click('button[type="submit"]');

    // Verificar mensaje de usuario amigable y no crudo (Regla 12.4 AGENTS.md)
    await expect(
      page.getByText('Se ha alcanzado temporalmente el límite de envío de correos. Espera unos minutos e inténtalo de nuevo.')
    ).toBeVisible();

    // Verificar activación del temporizador de cooldown en el botón para prevenir spam
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.locator('button[type="submit"]')).toContainText(/Reintentar en \d+s/);
  });

  test('Escenario 3: Emulación de Navegador Real (navigator.webdriver = undefined) y redirección canónica', async ({ page }) => {
    // AGENTS.md §12.3: Las pruebas no pueden depender de navigator.webdriver; al menos un caso debe forzarlo a undefined
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { configurable: true, get: () => undefined });
    });

    // 1. Acceder a la ruta no canónica /registro debe redirigir a la canónica /signup
    await page.goto('/registro');
    await expect(page).toHaveURL(/\/signup/);

    // 2. Verificar que no entra automáticamente en modo demo
    await expect(page.getByText('Modo Demo')).not.toBeVisible();
    await expect(page.locator('h1')).toContainText('Crear cuenta corporativa');

    // 3. En la pantalla de login, verificar enlace canónico de registro
    await page.goto('/login');
    const registerLink = page.getByRole('link', { name: 'Registra tu empresa gratis' });
    await expect(registerLink).toBeVisible();
    await registerLink.click();
    await expect(page).toHaveURL(/\/signup/);
  });

});
