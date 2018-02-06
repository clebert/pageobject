import {
  StandardAction,
  StandardElement,
  StandardPage
} from '@pageobject/standard';
import {By, WebDriver, WebElement, promise} from 'selenium-webdriver';

/* https://github.com/SeleniumHQ/selenium/issues/2969#issuecomment-307917606 */
promise.USE_PROMISE_MANAGER = false;

class SeleniumElement implements StandardElement {
  public readonly adaptee: WebElement;

  public constructor(adaptee: WebElement) {
    this.adaptee = adaptee;
  }

  public async click(): Promise<void> {
    return this.adaptee.click();
  }

  public async doubleClick(): Promise<void> {
    return this.adaptee
      .getDriver()
      .actions()
      .doubleClick()
      .perform();
  }

  public async perform<TElement extends Element, TResult>(
    action: StandardAction<TElement, TResult>,
    ...args: any[] /* tslint:disable-line no-any */
  ): Promise<TResult> {
    return this.adaptee
      .getDriver()
      .executeScript<TResult>(action, this.adaptee, ...args);
  }

  public async type(text: string): Promise<void> {
    for (const character of text.split('')) {
      await this.adaptee.sendKeys(character);
      await new Promise<void>(resolve => setTimeout(resolve, 100));
    }
  }
}

/**
 * ### Import
 *
 * **ES2015 modules**
 *
 * ```js
 * import {SeleniumPage} from '@pageobject/standard-selenium';
 * ```
 *
 * **CommonJS**
 *
 * ```js
 * const {SeleniumPage} = require('@pageobject/standard-selenium');
 * ```
 */
export class SeleniumPage implements StandardPage {
  /**
   * @param url The URL to navigate to.
   * @param driver An instance of the class [WebDriver](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html).
   */
  public static async load(
    url: string,
    driver: WebDriver
  ): Promise<SeleniumPage> {
    const page = new SeleniumPage(driver);

    await driver.navigate().to(url);

    return page;
  }

  /**
   * The parent [WebDriver](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html) instance for this page.
   */
  public readonly driver: WebDriver;

  /**
   * @param driver An instance of the class [WebDriver](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html).
   */
  public constructor(driver: WebDriver) {
    this.driver = driver;
  }

  public async findElements(
    selector: string,
    parent?: StandardElement
  ): Promise<StandardElement[]> {
    if (parent && !(parent instanceof SeleniumElement)) {
      throw new Error('Incompatible parent element');
    }

    return (await ((parent && parent.adaptee) || this.driver).findElements(
      By.css(selector)
    )).map(element => new SeleniumElement(element));
  }
}
