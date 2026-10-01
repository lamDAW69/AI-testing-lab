import { test, expect } from '@playwright/test';

test.describe('Navegación por Teclado en Command Palette', () => {
  test('debe abrirse mediante barra de búsqueda o atajo, filtrar y seleccionar con enter', async ({ page }) => {
    await page.goto('/app/inicio');

    // Abrir paleta de comandos
    await page.click('.command-search');

    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    const input = page.locator('div[role="dialog"] input');
    await expect(input).toBeFocused();

    // Escribir búsqueda
    await input.fill('dossier');

    // Verificar que filtra resultados
    await expect(page.locator('text=Ir al Dossier y Evidencias')).toBeVisible();

    // Presionar Enter para navegar
    await input.press('Enter');

    // Debe navegar a /app/dossier y cerrarse la paleta
    await expect(page).toHaveURL(/\/app\/dossier/);
    await expect(dialog).not.toBeVisible();
  });

  test('debe cerrarse al presionar la tecla Escape', async ({ page }) => {
    await page.goto('/app/inicio');

    await page.click('.command-search');
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});
