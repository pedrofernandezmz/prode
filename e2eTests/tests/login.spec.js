const { test, expect } = require('@playwright/test');

test('Flujo LOGIN', async ({ page }) => {

  await page.goto('http://localhost:8081');

  await page.waitForLoadState('networkidle');

  // Buscar el campo de correo por placeholder
  const emailInput = page.getByPlaceholder('Correo electrónico');
  await expect(emailInput).toBeVisible();
  await emailInput.click();
  await emailInput.fill('2009636@ucc.edu.ar');

  // Buscar el campo de contraseña por placeholder (los puntitos)
  const passwordInput = page.getByPlaceholder('•••••••••••');
  await expect(passwordInput).toBeVisible();
  await passwordInput.click();
  await passwordInput.fill('Talleres96');

  // Click en botón "Iniciar Sesión"
  const loginBtn = page.getByText('Iniciar Sesión', { exact: true });
  await expect(loginBtn).toBeVisible();
  await loginBtn.click();

  // Esperar a que cargue
  await page.waitForLoadState('networkidle');

  // Verificar que aparece la palabra "FECHAS"
  const fechasText = page.getByText('FECHAS', { exact: true });
  await expect(fechasText).toBeVisible();
});
