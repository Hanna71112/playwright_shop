import { type Locator } from '@playwright/test';

export default class ElementClicker {
  static async clickElement(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }
}
