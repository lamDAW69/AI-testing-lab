import { test, expect } from '@playwright/test';

test.describe('Aislamiento Multi-Tenant y Dossier de Empresa', () => {
  test('debe mostrar las 3 pestañas canónicas y los datos de solvencia del tenant activo', async ({ page }) => {
    await page.goto('/app/dossier');

    // Verificar las 3 pestañas canónicas (Regla 8 y 10 de AGENTS.md)
    await expect(page.locator('button:has-text("Perfil Corporativo")')).toBeVisible();
    await expect(page.locator('button:has-text("Certificaciones Oficiales")')).toBeVisible();
    await expect(page.locator('button:has-text("Evidencias y Solvencias")')).toBeVisible();

    // Comprobar que NO existen pestañas duplicadas ("Capacidades" o "Experiencia")
    await expect(page.locator('button:has-text("Capacidades")')).not.toBeVisible();
    await expect(page.locator('button:has-text("Experiencia")')).not.toBeVisible();

    // Comprobar presencia del CIF y Fondo Documental factual (sin porcentaje inventado)
    await expect(page.locator('text=B-88776655')).toBeVisible();
    await expect(page.locator('text=Fondo Documental')).toBeVisible();

    // Navegar a la pestaña de Evidencias
    await page.click('button:has-text("Evidencias y Solvencias")');

    // Verificar chips de filtro por categoría
    await expect(page.locator('button:has-text("Todas")')).toBeVisible();
    await expect(page.locator('button:has-text("Contratos previos")')).toBeVisible();
  });
});
