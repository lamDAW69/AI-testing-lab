import { test, expect } from '@playwright/test';

test.describe('Flujo de Reanálisis de Licitación tras Adenda', () => {
  test('debe mostrar alerta de adenda v2 y reanalizar correctamente actualizando a estado válido', async ({ page }) => {
    await page.goto('/app/portfolio/t-101');

    // Comprobar estado inicial que requiere reanálisis por adenda
    const warningBox = page.locator('text=Este análisis necesita actualizarse');
    await expect(warningBox).toBeVisible();
    await expect(page.locator('text=Versión analizada: v1 | Versión actual: v2')).toBeVisible();

    // Localizar y pulsar el botón de reanálisis
    const reanalyzeBtn = page.locator('button:has-text("Reanalizar con v2")');
    await expect(reanalyzeBtn).toBeVisible();
    await reanalyzeBtn.click();

    // Esperar a que el reanálisis termine: el banner de advertencia debe desaparecer
    await expect(warningBox).not.toBeVisible();

    // Debe mostrarse el banner de confirmación exitoso
    await expect(page.locator('text=Expediente actualizado a la versión documental v2')).toBeVisible();

    // Los badges y referencias deben reflejar la versión v2
    await expect(page.locator('text=Documentos base: v2')).toBeVisible();
  });
});
