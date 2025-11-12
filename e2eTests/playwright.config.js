// playwright.config.js
// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 30000,           // timeout máximo por test
  use: {
    headless: false,        // que se abra Chromium visible
    viewport: { width: 430, height: 932 },
    ignoreHTTPSErrors: true,
    video: 'on',
  },
  testDir: './tests',       // carpeta donde están los tests
});
