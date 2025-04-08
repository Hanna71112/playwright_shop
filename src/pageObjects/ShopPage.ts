import { type Locator, Page } from '@playwright/test';
import ElementClicker from '../utils/helpers/ElementClicker';
import { BasePage } from './BasePage';
import { BasketStorage } from './BasketStorage';
import { allure } from 'allure-playwright';
import TextEditor from '../utils/helpers/TextEditor';

export class ShopPage extends BasePage {
  private discountItem: string;
  private noDiscountItem: string;
  private getCartPriceValue: Locator;
  private getCartBookNameValue: Locator;
  private basketIcon: Locator;
  basketButton: Locator;
  clearBasketButton: Locator;
  private basketNumberItems: Locator;
  private nextPageButton: Locator;
  private buyBookButtonLocator: (itemLocator, index) => Locator;
  private getPriceCardLocator: (itemLocator, index) => Locator;
  private getTitleCardLocator: (itemLocator, index) => Locator;
  private inputAmountBookLocator: (itemLocator, index) => Locator;
  private checkBooksCountLocator: (itemLocator, index) => Locator;

  constructor(page: Page) {
    super(page);
    this.basketIcon = page.locator('[class*="basket_icon"]');
    this.basketButton = page.locator('[id="dropdownBasket"]');
    this.clearBasketButton = page.locator('//a[text()="Очистить корзину"]');
    this.discountItem = '//div[contains(@class, "note-item") and (contains(@class, "hasDiscount"))]';
    this.noDiscountItem = '//div[contains(@class, "note-item") and not(contains(@class, "hasDiscount"))]';
    this.getCartPriceValue = page.locator('[class="basket_price"]');
    this.getCartBookNameValue = page.locator('[class="basket_price"]');
    this.basketNumberItems = page.locator('span.basket-count-items');
    this.nextPageButton = page.locator('[class="page-item "]');
    this.basketIcon = page.locator('[id="dropdownBasket"]');
    this.buyBookButtonLocator = (itemLocator, index) =>
      this.page.locator(`(${itemLocator}//button[contains(@class,"actionBuyProduct")])[${index}]`);
    this.getPriceCardLocator = (itemLocator, index) =>
      this.page.locator(`(${itemLocator}/..//ancestor::span[contains(@class,"product_price")])[${index}]`);
    this.getTitleCardLocator = (itemLocator, index) =>
      this.page.locator(`(${itemLocator}/..//ancestor::div[contains(@class,"product_name")])[${index}]`);
    this.inputAmountBookLocator = (itemLocator, index) =>
      this.page.locator(`(${itemLocator}//input[contains(@name,"product-enter-count")])[${index}]`);
    this.checkBooksCountLocator = (itemLocator, index) =>
      this.page.locator(`(${itemLocator}//span[contains(@class,"product_count")])[${index}]`);
  }

  public async clickBasketIcon() {
    await allure.step('Нажимаю на иконку корзины', async () => {
      await ElementClicker.clickElement(this.basketIcon);
    });
  }

  public async addTheSameBookWithoutDiscount(count: number) {
    await allure.step('Добавляю товар в корзину', async () => {
      return await this.addBookToBasket(count, this.noDiscountItem);
    });
  }

  public async addTheSameBookWithDiscount(count: number) {
    await allure.step('Добавляю товар в корзину', async () => {
      return await this.addBookToBasket(count, this.discountItem);
    });
  }

  public async addDifferentBooksWithDiscount(count: number) {
    await allure.step('Добавляю товары в корзину', async () => {
      return await this.addBooksToBasket(count, this.discountItem);
    });
  }

  public async addDifferentBooksWithoutDiscount(count: number) {
    await allure.step('Добавляю товары в корзину', async () => {
      return await this.addBooksToBasket(count, this.noDiscountItem);
    });
  }

  private async getPriceFromItemCard(locator: Locator) {
    const price = await locator.textContent();
    const priceText = price.split(' ')[0];
    return Number(TextEditor.changePriceFormatToText(priceText));
  }

  private async getTitleFromItemCard(locator: Locator) {
    const priceText = await locator.textContent();
    return priceText;
  }

  /**
   * Метод для добавления одинакового товара.
   */
  private async addBookToBasket(amount: number, bookTypeLocator: string) {
    let index = 1;
    let booksCount = await this.checkBooksCountLocator(bookTypeLocator, index).textContent();
    while (amount > booksCount) {
      index++;
      booksCount = await this.checkBooksCountLocator(bookTypeLocator, index).textContent();
    }
    const inputAmountField = this.inputAmountBookLocator(bookTypeLocator, index);
    const buyBookButtonLocator = this.buyBookButtonLocator(bookTypeLocator, index);
    await ElementClicker.clickElement(inputAmountField);
    await inputAmountField.fill(amount.toString());
    await ElementClicker.clickElement(buyBookButtonLocator);
    await this.addInfoFromCardToStorage(amount, bookTypeLocator, index);
  }

  /**
   * Метод для получения названия, цены, количества товара из локатора для добавления в localStorage.
   */
  private async addInfoFromCardToStorage(amount, bookTypeLocator: string, index) {
    let price = await this.getPriceFromItemCard(this.getPriceCardLocator(bookTypeLocator, index));
    const title = await this.getTitleFromItemCard(this.getTitleCardLocator(bookTypeLocator, index));
    await BasketStorage.addItemToStorage(this.page, title, price * amount, amount);
  }

  private async countBooksOnCurrentPage(typeBookLocator: string) {
    await this.page.waitForSelector(typeBookLocator);
    const booksCount = await this.page.locator(typeBookLocator).count();
    return booksCount;
  }

  private async addBooksOnCurrentPage(bookTypeLocator: string, totalBooksToAdd: number, addedBooksCount: number) {
    const bookCountOnCurrentPage = await this.countBooksOnCurrentPage(bookTypeLocator);
    for (let i = 1; i <= bookCountOnCurrentPage && addedBooksCount < totalBooksToAdd; i++) {
      const bookLocator = this.buyBookButtonLocator(bookTypeLocator, i);
      if (await bookLocator.isVisible()) {
        await ElementClicker.clickElement(bookLocator);
        await this.addInfoFromCardToStorage(1, bookTypeLocator, i);
        addedBooksCount++;
      }
    }
    return addedBooksCount;
  }

  private async goToNextPage(currentPage: number) {
    const nextPageButton = this.page.locator(`[data-page-number="${currentPage + 1}"]`);
    if (await nextPageButton.isVisible()) {
      await nextPageButton.click();
      return currentPage + 1;
    }
    throw new Error(`Кнопка перехода на следующую страницу не найдена.`);
  }

  /**
   * Метод для добавления разных товаров.
   */
  private async addBooksToBasket(totalBooksToAdd: number, bookTypeLocator: string) {
    let addedBooksCount = 0;
    let currentPage = 1;
    let pagesCount = 2;
    while (addedBooksCount <= totalBooksToAdd && currentPage <= pagesCount) {
      addedBooksCount = await this.addBooksOnCurrentPage(bookTypeLocator, totalBooksToAdd, addedBooksCount);
      if (addedBooksCount >= totalBooksToAdd) {
        return;
      }
      currentPage = await this.goToNextPage(currentPage);
    }
    throw new Error(`Недостаточно акционных товаров. Добавлено ${addedBooksCount}, из ${totalBooksToAdd}.`);
  }

  public async getBasketNumberItemsOnUI() {
    const basketNumber = await this.basketNumberItems;
    return basketNumber.textContent();
  }

  public async getBasketNumberItemsAfterChanging() {
    const basketCount = await allure.step('Рядом с корзиной отображается количество товаров в корзине', async () => {
      const basketResponse = await this.page.waitForResponse(
        response => response.url().includes('/basket/get') && response.status() === 200,
      );
      const responseData = await basketResponse.json();
      return responseData?.basketCount;
    });
    return String(basketCount);
  }
}
export default ShopPage;
