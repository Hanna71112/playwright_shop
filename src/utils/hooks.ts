import ElementClicker from './helpers/ElementClicker';
import { ShopPage } from '../pageObjects/ShopPage';
import { BasketPopup } from '../pageObjects/BasketPopup';

import { type Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export async function clearBasket(page: Page, basketPopup: BasketPopup, shopPage: ShopPage) {
  await allure.step('Очищаю корзину', async () => {
    const basketItemCount = await shopPage.getBasketNumberItemsOnUI();
    if (basketItemCount === '9') {
      await shopPage.addTheSameBookWithoutDiscount(1);
      const updatedNumberOfBooks = await shopPage.getBasketNumberItemsAfterChanging();
      if (updatedNumberOfBooks !== '10') {
        console.warn('Корзина не была очищена корректно, количество товаров не равно 10.');
      }
    }
    if (basketItemCount === '0') {
      return;
    }
    await ElementClicker.clickElement(shopPage.basketButton);
    await ElementClicker.clickElement(shopPage.clearBasketButton);
    const numberOfBooksAfterClearing = await shopPage.getBasketNumberItemsAfterChanging();
    if (numberOfBooksAfterClearing !== '0') {
      console.warn('Корзина не была очищена корректно, количество товаров не равно 0.');
    }
  });
}
