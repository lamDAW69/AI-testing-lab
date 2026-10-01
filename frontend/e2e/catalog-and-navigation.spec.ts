import { test, expect } from '@playwright/test';

test.describe('Navegación y Catálogo de Licitaciones', () => {
  test('debe cargar la página de inicio y mostrar métricas de cartera', async ({ page }) => {
    await page.goto('/app/inicio');

    // Verificar saludo editorial
    await expect(page.locator('h1.home-greeting')).toBeVisible();

    // Verificar presencia de los KPIs superiores
    await expect(page.locator('text=Oportunidades en cartera')).toBeVisible();
    await expect(page.getByText('En evaluación', { exact: true })).toBeVisible();

    // Navegar al catálogo mediante la barra lateral
    await page.click('a[href="/app/catalogo"]');
    await expect(page).toHaveURL(/\/app\/catalogo/);

    // Verificar listado de expedientes en el catálogo
    await expect(
      page.locator('text=Servicio de desarrollo y modernización de plataforma cloud para la DGT').first()
    ).toBeVisible();
  });

  test('debe navegar desde el catálogo al detalle de una licitación', async ({ page }) => {
    await page.goto('/app/catalogo');

    // Hacer clic en la licitación de la DGT
    await page.locator('text=Servicio de desarrollo y modernización de plataforma cloud para la DGT').first().click();
    await expect(page).toHaveURL(/\/app\/oportunidades\/t-101/);

    // Verificar datos clave del detalle
    await expect(page.locator('text=Dirección General de Tráfico')).toBeVisible();
    await expect(page.locator('text=Pliego_Clausulas_Administrativas_Particulares.pdf')).toBeVisible();
  });
});
