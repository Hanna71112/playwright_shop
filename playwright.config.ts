const { defineConfig, devices } = require('@playwright/test');

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  globalSetup: './src/utils/globalSetup.ts',
  reporter: [['allure-playwright']],
  use: {
    headless: true,
    storageState: 'state.json',
    baseURL: 'https://enotes.pointschool.ru/',
    screenshot: 'only-on-failure',
    trace: 'on',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'on',
        video: {
          mode: 'retain-on-failure',
        },
      },
    },
    // {
    //     name: 'firefox',
    //     use: { ...devices['Desktop Firefox'] },
    // },
  ],
});
