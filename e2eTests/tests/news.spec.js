const { test, expect } = require('@playwright/test');
const { login } = require('../utils/login');

test('Flujo NOTICIAS', async ({ page }) => {
  // Login
  await login(page);

  // Verificar que aparezca la pestaña "Noticias"
  await expect(page.getByText('Noticias')).toBeVisible();

  // Hacer click en "Noticias"
  await page.getByText('Noticias').click();

  // Esperar que cargue la sección de noticias
  await page.waitForLoadState('networkidle');

  // Hacer click en el centro de la pantalla
  const viewport = page.viewportSize(); // obtener tamaño actual de la pantalla
  const centerX = viewport.width / 2;
  const centerY = viewport.height / 2;

  await page.mouse.click(centerX, centerY);

  await page.waitForTimeout(2000);

  await page.getByText('CERRAR').click();

});
