import { test as base } from '@playwright/test';
import { BasketPopup } from '../pageObjects/BasketPopup';
import { ShopPage } from '../pageObjects/ShopPage';
import { BasketStorage } from '../pageObjects/BasketStorage';

export const test = base.extend<{ basketPopup: BasketPopup; shopPage: ShopPage; basketStorage: BasketStorage }>({
  basketPopup: async ({ page }, use) => {
    const basketPopup = new BasketPopup(page);
    await use(basketPopup);
  },
  shopPage: async ({ page }, use) => {
    const shopPage = new ShopPage(page);
    await use(shopPage);
  },
  basketStorage: async ({ page }, use) => {
    const basketStorage = new BasketStorage(page);
    await use(basketStorage);
  },
});

export { expect } from '@playwright/test';
