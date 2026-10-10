import { test, expect } from '@playwright/test';

test.describe('Adversarial Stress Testing & Edge Cases — Challenger 2', () => {

  test('Adversarial 1: Captura de 403 Forbidden en GET /onboarding/membership con auto-provisión de rescate', async ({ page }) => {
    // Escenario hostil: Backend legado o proxy devuelve 403 Forbidden en GET /onboarding/membership.
    // El frontend debe capturar el 403 de forma transparente y rescatar la provisión mediante POST /onboarding/tenant.
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { configurable: true, get: () => undefined });
    });

    let tenantProvisionCalled = false;

    await page.route('**/auth/v1/token*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'adversarial-token-403-test',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'adversarial-refresh-token',
          user: {
            id: 'aaaa1111-2222-3333-4444-555555555555',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'rescue@empresa.com',
            email_confirmed_at: new Date().toISOString(),
            user_metadata: {
              full_name: 'Usuario Rescate',
              company_name: 'Empresa Rescatada S.L.',
              tax_id: 'B-12345678',
              cpv_sector: '72000000',
            },
          },
        }),
      });
    });

    // Simular 403 Forbidden en /onboarding/membership
    await page.route('**/api/onboarding/membership*', async (route) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Forbidden: No active tenant',
        }),
      });
    });

    // Interceptar POST /onboarding/tenant
    await page.route('**/api/onboarding/tenant*', async (route) => {
      tenantProvisionCalled = true;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            tenantId: 'res-1111-2222-3333-4444-555555555555',
            name: 'Empresa Rescatada S.L.',
            taxId: 'B-12345678',
            role: 'owner',
          },
        }),
      });
    });

    // Mocks de rutas internas
    await page.route('**/api/portfolio**', (route) => route.fulfill({ json: [] }));
    await page.route('**/api/alerts**', (route) => route.fulfill({ json: [] }));
    await page.route('**/api/dossier/**', (route) => route.fulfill({ json: {} }));
    await page.route('**/api/public/**', (route) => route.fulfill({ json: [] }));

    await page.goto('/login');
    await page.fill('input[type="email"]', 'rescue@empresa.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Debe llegar a /app/inicio sin bloquear al usuario
    await expect(page).toHaveURL(/\/app\/inicio/);
    expect(tenantProvisionCalled).toBe(true);
    await expect(page.getByText('Empresa Rescatada S.L.').first()).toBeVisible();
    await expect(page.getByText('Modo Demo')).not.toBeVisible();
  });

  test('Adversarial 2: Manejo de variantes heterogéneas de error 429 en autenticación', async ({ page }) => {
    // Probar que el mensaje amigable se muestra para múltiples formas de error de límite
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { configurable: true, get: () => undefined });
    });

    // Variante A: Status 429 sin código explícito pero con mensaje "Too many requests"
    await page.route('**/auth/v1/signup*', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Too many requests. Please try again later.',
        }),
      });
    });

    await page.goto('/signup');
    await page.fill('input[placeholder="Carlos Gómez"]', 'Adversarial Test');
    await page.fill('input[placeholder="carlos@empresa.es"]', 'adv@empresa.es');
    await page.fill('input[placeholder="Mínimo 8 caracteres"]', 'Password123!');
    await page.fill('input[placeholder="InnovaTech Consultoría S.L."]', 'Test S.L.');
    await page.fill('input[placeholder="B-12345678"]', 'B-12345678');
    await page.click('button[type="submit"]');

    await expect(
      page.getByText('Se ha alcanzado temporalmente el límite de envío de correos. Espera unos minutos e inténtalo de nuevo.')
    ).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });

  test('Adversarial 3: Navegación canónica de todas las rutas técnicas de Auth', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { configurable: true, get: () => undefined });
    });

    // 1. /login existe y es accesible
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);

    // 2. /signup existe y es accesible
    await page.goto('/signup');
    await expect(page).toHaveURL(/\/signup/);

    // 3. /registro redirige a /signup
    await page.goto('/registro');
    await expect(page).toHaveURL(/\/signup/);

    // 4. /forgot-password existe y es accesible
    await page.goto('/forgot-password');
    await expect(page).toHaveURL(/\/forgot-password/);

    // 5. /reset-password existe y es accesible
    await page.goto('/reset-password');
    await expect(page).toHaveURL(/\/reset-password/);
  });

  test('Adversarial 4: Acceso a /app sin sesión redirige estrictamente a /login', async ({ page }) => {
    // Con navigator.webdriver = undefined y sin sesión, el acceso a rutas protegidas
    // debe rebotar a /login y jamás entrar en modo demo por accidente
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { configurable: true, get: () => undefined });
    });

    await page.goto('/app/inicio');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText('Modo Demo')).not.toBeVisible();

    await page.goto('/app/dossier');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText('Modo Demo')).not.toBeVisible();
  });

});
