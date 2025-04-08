import { test, expect } from '../src/fixtures/fixtures';
import { clearBasket } from '../src/utils/hooks';

test.beforeEach(async ({ page, basketPopup, shopPage }) => {
  await page.goto('/');
  await clearBasket(page, basketPopup, shopPage);
});
test.describe('Проверка функциональности корзины', () => {
  test('Переход в пустую корзину.', async ({ page, shopPage, basketPopup }) => {
    await shopPage.clickBasketIcon();
    await basketPopup.verifyBasketPopupVisible();
    await basketPopup.clickGoToBasketButton();
    await expect(page).toHaveURL('/basket');
  });

  test('Переход в корзину с 1 неакционным товаром.', async ({ page, shopPage, basketPopup, basketStorage }) => {
    await shopPage.addTheSameBookWithDiscount(1);
    const numberOfBooks = await shopPage.getBasketNumberItemsAfterChanging();
    expect(numberOfBooks).toEqual('1');
    await shopPage.clickBasketIcon();
    await basketPopup.verifyBasketPopupVisible();
    const priceFromStorage = await basketStorage.getDataFromStorage('price');
    const priceFromPopup = await basketPopup.getBasketPopupData('price');
    await expect(priceFromPopup).toEqual(priceFromStorage);
    const totalPriceFromStorage = await basketStorage.getDataFromStorage('totalPrice');
    const totalPriceFromPopup = await basketPopup.getBasketPopupData('totalPrice');
    await expect(totalPriceFromPopup).toEqual(totalPriceFromStorage);
    const titleFromStorage = await basketStorage.getDataFromStorage('title');
    const titleFromPopup = await basketPopup.getBasketPopupData('title');
    await expect(titleFromPopup).toEqual(titleFromStorage);
    await basketPopup.clickGoToBasketButton();
    await expect(page).toHaveURL('/basket');
  });

  test('Переход в корзину с 1 акционным товаром.', async ({ page, shopPage, basketPopup, basketStorage }) => {
    await shopPage.addTheSameBookWithoutDiscount(1);
    const numberOfBooks = await shopPage.getBasketNumberItemsAfterChanging();
    expect(numberOfBooks).toEqual('1');
    await shopPage.clickBasketIcon();
    await basketPopup.verifyBasketPopupVisible();
    const priceFromStorage = await basketStorage.getDataFromStorage('price');
    const priceFromPopup = await basketPopup.getBasketPopupData('price');
    await expect(priceFromPopup).toEqual(priceFromStorage);
    const totalPriceFromStorage = await basketStorage.getDataFromStorage('totalPrice');
    const totalPriceFromPopup = await basketPopup.getBasketPopupData('totalPrice');
    await expect(totalPriceFromPopup).toEqual(totalPriceFromStorage);
    const titleFromStorage = await basketStorage.getDataFromStorage('title');
    const titleFromPopup = await basketPopup.getBasketPopupData('title');
    await expect(titleFromPopup).toEqual(titleFromStorage);
    await basketPopup.clickGoToBasketButton();
    await expect(page).toHaveURL('/basket');
  });

  test('Переход в корзину с 9 разными товарами.', async ({ page, shopPage, basketPopup, basketStorage }) => {
    await shopPage.addTheSameBookWithDiscount(1);
    await shopPage.addDifferentBooksWithoutDiscount(6);
    await shopPage.addDifferentBooksWithDiscount(2);
    const numberOfBooks = await shopPage.getBasketNumberItemsAfterChanging();
    expect(numberOfBooks).toEqual('9');
    await shopPage.clickBasketIcon();
    await basketPopup.verifyBasketPopupVisible();
    const priceFromStorage = await basketStorage.getDataFromStorage('price');
    const priceFromPopup = await basketPopup.getBasketPopupData('price');
    await expect(priceFromPopup).toEqual(priceFromStorage);
    const totalPriceFromStorage = await basketStorage.getDataFromStorage('totalPrice');
    const totalPriceFromPopup = await basketPopup.getBasketPopupData('totalPrice');
    await expect(totalPriceFromPopup).toEqual(totalPriceFromStorage);
    const titleFromStorage = await basketStorage.getDataFromStorage('title');
    const titleFromPopup = await basketPopup.getBasketPopupData('title');
    await expect(titleFromPopup).toEqual(titleFromStorage);
    await basketPopup.clickGoToBasketButton();
    await expect(page).toHaveURL('/basket');
  });

  test('Переход в корзину с 9 акционными товарами одного наименования', async ({
    page,
    shopPage,
    basketPopup,
    basketStorage,
  }) => {
    await shopPage.addTheSameBookWithDiscount(9);
    const numberOfBooks = await shopPage.getBasketNumberItemsAfterChanging();
    expect(numberOfBooks).toEqual('9');
    await shopPage.clickBasketIcon();
    await basketPopup.verifyBasketPopupVisible();
    const priceFromStorage = await basketStorage.getDataFromStorage('price');
    const priceFromPopup = await basketPopup.getBasketPopupData('price');
    await expect(priceFromPopup).toEqual(priceFromStorage);
    const totalPriceFromStorage = await basketStorage.getDataFromStorage('totalPrice');
    const totalPriceFromPopup = await basketPopup.getBasketPopupData('totalPrice');
    await expect(totalPriceFromPopup).toEqual(totalPriceFromStorage);
    const titleFromStorage = await basketStorage.getDataFromStorage('title');
    const titleFromPopup = await basketPopup.getBasketPopupData('title');
    await expect(titleFromPopup).toEqual(titleFromStorage);
    await basketPopup.clickGoToBasketButton();
    await expect(page).toHaveURL('/basket');
  });
});
