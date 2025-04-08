import { expect, type Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import TextEditor from '../utils/helpers/TextEditor';
import ElementClicker from '../utils/helpers/ElementClicker';
import { allure } from 'allure-playwright';

export class BasketPopup extends BasePage {
  private readonly basketPopup: Locator;
  private readonly getBookPriceValue: Locator;
  private readonly getBasketBookNameValue: Locator;
  private readonly getTotalPriceValue: Locator;
  readonly goToBasketButton: Locator;

  constructor(page: Page) {
    super(page);
    this.getBookPriceValue = page.locator('[class="basket-item-price"]');
    this.getTotalPriceValue = page.locator('[class="basket_price"]');
    this.getBasketBookNameValue = page.locator('[class="basket-item-title"]');
    this.basketPopup = page.locator('[aria-labelledby="dropdownBasket"]');
    this.goToBasketButton = page.locator('//a[text()="Перейти в корзину"]');
  }

  async clickGoToBasketButton() {
    await allure.step('Нажимаю на кнопку Перейти в корзину', async () => {
      await ElementClicker.clickElement(this.goToBasketButton);
    });
  }

  async verifyBasketPopupVisible() {
    await allure.step('Открывается окно корзины', async () => {
      await this.basketPopup.waitFor({ state: 'visible', timeout: 5000 });
      await expect(this.basketPopup).toBeVisible();
    });
  }

  async getBasketPopupData(type) {
    const locators = {
      title: await this.getBasketBookNameValue.elementHandles(),
      price: await this.getBookPriceValue.elementHandles(),
      totalPrice: await this.getTotalPriceValue.elementHandles(),
    };

    const elements = await locators[type];
    const result = [];
    await allure.step(`Извлечение данных из окна корзины для "${type}"`, async () => {
      for (const element of elements) {
        const content = await element.textContent();
        if (type === 'price' || type === 'totalPrice') {
          result.push(Number(TextEditor.changePriceFormatToText(content)));
        } else {
          result.push(content);
        }
      }
    });
    return result;
  }
}
