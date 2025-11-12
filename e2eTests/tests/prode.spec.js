const { test, expect } = require('@playwright/test');
const { login } = require('../utils/login');

test('Flujo PRODE', async ({ page }) => {
  // Login
  await login(page);

  // Ir a Prode
  await expect(page.getByText('Prode')).toBeVisible();
  await page.getByText('Prode').click();
  await page.waitForLoadState('networkidle');

  // Verificar "POZO ACUMULADO"
  await expect(page.getByText('POZO ACUMULADO')).toBeVisible();

  // Ir a MIS RESULTADOS
  await expect(page.getByText('MIS RESULTADOS')).toBeVisible();
  await page.getByText('MIS RESULTADOS').click();
  await page.waitForLoadState('networkidle');

  // Verificar "Predicción:"
  await expect(page.getByText('ESTADO: ')).toBeVisible();

  // Volver a "INICIO"
  await page.getByText('INICIO').first().click();
  await page.waitForLoadState('networkidle');

  // Ir a RANKING
  const rankingBtn = page.getByText('RANKING', { exact: true });
  await rankingBtn.click();
  await page.waitForLoadState('networkidle');

  // Verificar "Usuario"
  await expect(page.getByText('Jugadas')).toBeVisible();

  // Volver a "INICIO"
  await page.getByText('INICIO').first().click();
  await page.waitForLoadState('networkidle');

  // Ir a "JUGAR"
  await expect(page.getByText('JUGAR')).toBeVisible();
  await page.getByText('JUGAR').first().click();
  await page.waitForLoadState('networkidle');

  // Hacer click en "MODIFICAR" si existe
  const modificarBtn = page.locator('text=MODIFICAR').first();
  try {
    await modificarBtn.waitFor({ state: 'visible', timeout: 2000 });
    await modificarBtn.scrollIntoViewIfNeeded();
    await modificarBtn.click();
    await page.waitForLoadState('networkidle');
  } catch {
    console.log('MODIFICAR no existe, se continúa con el flujo');
  }


  // Hace un pronostico al azar
const opciones = ['Local', 'Empate', 'Visitante'];

// Cada partido tiene un div que contiene "Local", "Empate" o "Visitante"
const partidos = page.locator('div', { hasText: 'Local' }); // tomamos "Local" como referencia para cada partido
const partidosCount = await partidos.count();

for (let i = 0; i < partidosCount; i++) {
  // Elegir una opción al azar
  const opcionElegida = opciones[Math.floor(Math.random() * opciones.length)];

  // Buscar el div correspondiente a la opción elegida dentro del partido
  const eleccion = page.locator('div', { hasText: opcionElegida }).nth(i);

  await eleccion.scrollIntoViewIfNeeded();
  await eleccion.click();
}

  // Click en "GUARDAR"
  await expect(page.getByText('GUARDAR')).toBeVisible();
  await page.getByText('GUARDAR').first().click();
  await page.waitForLoadState('networkidle');

  // Ir a "REGLAS"
  await expect(page.getByText('REGLAS')).toBeVisible();
  await page.getByText('REGLAS').first().click();
  await page.waitForLoadState('networkidle');

  // Verificar texto "REGLAS DEL JUEGO PRODE"
  await expect(page.getByText('REGLAS DEL JUEGO PRODE')).toBeVisible();
});
