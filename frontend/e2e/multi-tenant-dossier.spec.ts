import { test, expect } from '@playwright/test';

test.describe('Aislamiento Multi-Tenant y Dossier de Empresa', () => {
  test('debe mostrar las 3 pestañas canónicas y los datos de solvencia del tenant activo', async ({ page }) => {
    await page.goto('/app/dossier');

    // Verificar las 3 pestañas canónicas (Regla 8 y 10 de AGENTS.md)
    const perfilTab = page.locator('button.dossier-tab:has-text("Perfil")');
    const certsTab = page.locator('button.dossier-tab:has-text("Certificaciones")');
    const evidenciasTab = page.locator('button.dossier-tab:has-text("Evidencias")');

    await expect(perfilTab).toBeVisible();
    await expect(certsTab).toBeVisible();
    await expect(evidenciasTab).toBeVisible();

    // Comprobar que NO existen pestañas duplicadas ("Capacidades" o "Experiencia")
    await expect(page.locator('button:has-text("Capacidades")')).not.toBeVisible();
    await expect(page.locator('button:has-text("Experiencia")')).not.toBeVisible();

    // Comprobar presencia de Fondo Documental factual (sin porcentaje inventado)
    await expect(page.locator('text=Fondo Documental')).toBeVisible();

    // Navegar a la pestaña de Perfil y comprobar CIF del tenant
    await perfilTab.click();
    await expect(page.getByText('B-88776655', { exact: true }).first()).toBeVisible();

    // Navegar a la pestaña de Evidencias y comprobar chips de filtro
    await evidenciasTab.click();
    await expect(page.locator('button:has-text("Todas")')).toBeVisible();
    await expect(page.locator('button:has-text("Contratos previos")')).toBeVisible();
  });

  test('debe permitir declarar una nueva certificación y reflejarla en el dossier con estado DECLARED', async ({ page }) => {
    await page.goto('/app/dossier');

    // Pulsar botón de añadir certificación
    await page.locator('button:has-text("Añadir certificación")').click();

    // Rellenar formulario en el drawer
    await page.fill('input[placeholder="Ej: ISO 27001 o ENS Nivel Medio"]', 'Certificación ISO 14001 Medioambiental');
    await page.fill('input[placeholder="Ej: AENOR, TÜV Rheinland, BSI"]', 'TÜV Rheinland');
    await page.click('button:has-text("Guardar declaración")');

    // Comprobar que la nueva certificación aparece en la lista con estado DECLARED
    await expect(page.getByText('Certificación ISO 14001 Medioambiental')).toBeVisible();
    await expect(page.getByText('TÜV Rheinland')).toBeVisible();
    await expect(page.getByText('DECLARED').first()).toBeVisible();
  });
});
