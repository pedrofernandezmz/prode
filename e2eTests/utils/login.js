async function login(page) {
  await page.goto('http://localhost:8081');
  await page.getByPlaceholder('Correo electrónico').fill('2009636@ucc.edu.ar');
  await page.getByPlaceholder('•••••••••••').fill('Talleres96');
  await page.getByText('Iniciar Sesión', { exact: true }).click();
}

module.exports = { login };
