import { chromium, expect } from '@playwright/test';
require('dotenv').config();

async function globalSetup() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const login = process.env.LOGIN;
  const password = process.env.PASSWORD;

  await page.goto('https://enotes.pointschool.ru');
  await page.click('[href="/login"]');
  await page.type('[id="loginform-username"]', login, { delay: 100 });
  await page.type('[id="loginform-password"]', password, { delay: 100 });
  await page.click('button[type="submit"]');
  try {
    await expect(page.locator('[id="basketContainer"]')).toBeVisible({ timeout: 2000 });
  } catch (error) {
    throw new Error('Пользователь не залогинился!');
  }
  await page.context().storageState({ path: 'state.json' });
  await browser.close();
}

export default globalSetup;
