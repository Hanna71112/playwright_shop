import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { allure } from 'allure-playwright';

class BasketStorage extends BasePage {
  private page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }
  /**
   * Метод для сохранения данных о товаре в localStorage.
   * @param title - название товара.
   * @param price - цена.
   * @param amount - количество.
   */
  static async addItemToStorage(page: Page, title: string, price: number, amount: number) {
    const totalPrice = price;
    await page.evaluate(
      ({ title, price, amount, totalPrice }) => {
        const existingItems = JSON.parse(localStorage.getItem('basketItems') || '[]');
        const newItem = { title, price, amount, totalPrice };
        existingItems.push(newItem);
        localStorage.setItem('basketItems', JSON.stringify(existingItems));
      },
      { title, price, totalPrice },
    );
  }

  /**
   * Метод для получения данных из localStorage.
   * @returns массив данных корзины.
   */
  public async getDataFromStorage(type: 'title' | 'price' | 'totalPrice') {
    return await allure.step(`Извлечение данных из локального хранилища для "${type}"`, async () => {
      return await this.page.evaluate(type => {
        const items = JSON.parse(localStorage.getItem('basketItems') || '[]');

        if (type === 'totalPrice') {
          const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
          return [totalPrice];
        }
        if (type === 'title') {
          const values = items.map(item => item[type]);
          return Array.from(new Set(values));
        }
        return items.map(item => item[type]);
      }, type);
    });
  }
}

export { BasketStorage };
