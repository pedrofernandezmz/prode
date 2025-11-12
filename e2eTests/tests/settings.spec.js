const { test, expect } = require('@playwright/test');
const { login } = require('../utils/login');

test('Flujo USUARIO', async ({ page }) => {
  // Hacer login
  await login(page);

  // Ir a Usuario
  await expect(page.getByText('Usuario')).toBeVisible();
  await page.getByText('Usuario').click();
  await page.waitForLoadState('networkidle');

  // Ir a Editar Perfil
  await expect(page.getByText('Editar Perfil')).toBeVisible();
  await page.getByText('Editar Perfil').click();
  await page.waitForLoadState('networkidle');

  // Verificar "Predicción:"
  await expect(page.getByText('Fecha de Nacimiento')).toBeVisible();

  // Volver a Usuario
  await page.getByText('Cancelar').first().click();
  await page.waitForLoadState('networkidle');

  // Hacer click en Cerrar Sesión
  await expect(page.getByText('Cerrar Sesión')).toBeVisible();
  await page.getByText('Cerrar Sesión').click();
  await page.waitForLoadState('networkidle');

  // Verificar que aparezca "¡Bienvenido!"
  await expect(page.getByText('¡Bienvenido!')).toBeVisible();
});
