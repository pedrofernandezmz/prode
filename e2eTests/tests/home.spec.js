const { test, expect } = require('@playwright/test');
const { login } = require('../utils/login');

test('Flujo INICIO', async ({ page }) => {
  // Login
  await login(page);

  // Verificar que aparezcan las FECHAS
  await expect(page.getByText('FECHAS')).toBeVisible();

  // Click en FECHA 7
  await page.getByText(/FECHA\s*7/).click();
  await expect(page.getByText('Talleres de Córdoba')).toBeVisible();

  // Buscar Talleres de Córdoba
  await page.getByText('Talleres de Córdoba').click();

  // Verificar Estadio, ALINEACIONES y ESTADÍSTICAS DEL PARTIDO
  await expect(page.getByText('Estadio')).toBeVisible();
  await expect(page.getByText('ALINEACIONES')).toBeVisible();
  await expect(page.getByText('ESTADÍSTICAS DEL PARTIDO')).toBeVisible();

  // Ir a TABLAS
  await page.getByText('TABLAS').click();
  await expect(page.getByText('CLAUSURA')).toBeVisible();

  // Ir a CLAUSURA
  await page.getByText('CLAUSURA').click();
  await expect(page.getByText('River')).toBeVisible();

  // Ir a ANUAL
  await page.getByText('ANUAL').click();
  await expect(page.getByText('Boca Jrs.')).toBeVisible();

  // Ir a ESTADISTICAS
  await page.getByText('ESTADISTICAS').click();
  await expect(page.getByText('Goles')).toBeVisible();
});
