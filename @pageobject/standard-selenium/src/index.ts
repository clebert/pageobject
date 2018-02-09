import {
  StandardAction,
  StandardElement,
  StandardKey,
  StandardPage
} from '@pageobject/standard';
import {
  ActionSequence,
  By,
  Key,
  WebDriver,
  WebElement
} from 'selenium-webdriver';

/* https://github.com/SeleniumHQ/selenium/blob/master/javascript/node/selenium-webdriver/CHANGES.md#v400-alpha1 */
interface WebDriver4 extends WebDriver {
  actions(options?: {bridge: boolean}): ActionSequence;
}

class SeleniumElement implements StandardElement {
  public readonly adaptee: WebElement;

  public constructor(adaptee: WebElement) {
    this.adaptee = adaptee;
  }

  public async click(): Promise<void> {
    return this.adaptee.click();
  }

  public async doubleClick(): Promise<void> {
    const driver: WebDriver4 = this.adaptee.getDriver();

    return driver
      .actions({bridge: true})
      .doubleClick(this.adaptee)
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

  public async sendCharacter(character: string): Promise<void> {
    if (character.length !== 1) {
      throw new Error('Invalid character');
    }

    return this.adaptee.sendKeys(character);
  }

  public async sendKey(key: StandardKey): Promise<void> {
    switch (key) {
      case StandardKey.ENTER:
        return this.adaptee.sendKeys(Key.ENTER);
      case StandardKey.ESCAPE:
        return this.adaptee.sendKeys(Key.ESCAPE);
      case StandardKey.TAB: {
        return this.adaptee.sendKeys(Key.TAB);
      }
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
