import { test, expect } from '@playwright/test';

test.describe('Landing Page y Flujo de Registro / Onboarding', () => {
  test('debe cargar la Landing Page pública en la ruta raíz con información del producto', async ({ page }) => {
    await page.goto('/');

    // Verificar presencia del logo y titular principal de valor
    await expect(page.locator('text=Pliego AI').first()).toBeVisible();
    await expect(page.locator('h1')).toContainText('De la licitación pública a la oferta adjudicada');

    // Verificar secciones clave de explicación de producto
    await expect(page.locator('#como-funciona')).toBeVisible();
    await expect(page.locator('#dossier')).toBeVisible();
    await expect(page.locator('#seguridad')).toBeVisible();

    // Verificar CTAs
    await expect(page.locator('text=Comenzar Registro Corporativo').first()).toBeVisible();
    await expect(page.locator('text=Explorar Demo en Vivo (Sin Registro)').first()).toBeVisible();
  });

  test('debe acceder a la aplicación mediante el botón de Demo Interactiva', async ({ page }) => {
    await page.goto('/');

    // Hacer clic en Explorar Demo en Vivo
    await page.locator('text=Explorar Demo en Vivo (Sin Registro)').first().click();

    // Debe navegar al espacio autenticado /app/inicio
    await expect(page).toHaveURL(/\/app\/inicio/);
    await expect(page.locator('h1.home-greeting')).toBeVisible();
  });

  test('debe permitir dar de alta una nueva empresa en el formulario de registro', async ({ page }) => {
    await page.goto('/registro');

    // Verificar título del onboarding
    await expect(page.locator('h1')).toContainText('Crear cuenta corporativa');

    // Rellenar datos del operador
    await page.fill('input[placeholder="Carlos Gómez"]', 'Elena Martínez');
    await page.fill('input[placeholder="carlos@empresa.es"]', 'elena@novatech-solutions.com');
    await page.fill('input[placeholder="Mínimo 8 caracteres"]', 'SuperSecretPass2026!');

    // Rellenar datos de la empresa (Tenant)
    await page.fill('input[placeholder="InnovaTech Consultoría S.L."]', 'NovaTech Solutions S.L.');
    await page.fill('input[placeholder="B-12345678"]', 'B-99887766');

    // Enviar registro
    await page.click('button[type="submit"]');

    // Debe navegar a /app/inicio con el nuevo usuario activo
    await expect(page).toHaveURL(/\/app\/inicio/);
    await expect(page.locator('h1.home-greeting')).toContainText('Hola, Elena.');
  });

  test('debe permitir navegar entre login, registro y la página principal', async ({ page }) => {
    await page.goto('/login');

    // Verificar que existe el enlace a registro
    await expect(page.locator('text=Registra tu empresa gratis')).toBeVisible();

    // Navegar a registro
    await page.click('text=Registra tu empresa gratis');
    await expect(page).toHaveURL(/\/registro/);

    // Navegar de vuelta a la página principal
    await page.goto('/login');
    await page.click('text=← Volver a la página principal');
    await expect(page).toHaveURL('http://localhost:5173/');
  });
});
