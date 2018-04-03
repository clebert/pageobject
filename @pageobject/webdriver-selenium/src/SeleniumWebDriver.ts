// tslint:disable no-redundant-jsdoc

import {Argument, Key, WebDriver, WebElement} from '@pageobject/web';
import * as selenium from 'selenium-webdriver';

interface WebDriver4 extends selenium.WebDriver {
  actions(options?: {bridge: boolean}): selenium.ActionSequence;
}

class SeleniumWebElement implements WebElement {
  public readonly adaptee: selenium.WebElement;

  public constructor(adaptee: selenium.WebElement) {
    this.adaptee = adaptee;
  }

  public async click(): Promise<void> {
    return this.adaptee.click();
  }

  public async doubleClick(): Promise<void> {
    return (this.adaptee.getDriver() as WebDriver4)
      .actions({bridge: true})
      .doubleClick(this.adaptee)
      .perform();
  }

  public async execute<THTMLElement extends HTMLElement, TResult>(
    script: (element: THTMLElement, ...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    return this.adaptee
      .getDriver()
      .executeScript<TResult>(script, this.adaptee, ...args);
  }
}

/**
 * @implements https://pageobject.js.org/api/web/interfaces/webdriver.html
 */
export class SeleniumWebDriver implements WebDriver {
  /**
   * @param capabilities https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
   */
  public static async create(capabilities: object): Promise<SeleniumWebDriver> {
    return new SeleniumWebDriver(
      // tslint:disable-next-line await-promise
      await new selenium.Builder().withCapabilities(capabilities).build()
    );
  }

  public readonly adaptee: selenium.WebDriver;

  /**
   * @param adaptee http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html
   */
  public constructor(adaptee: selenium.WebDriver) {
    this.adaptee = adaptee;
  }

  public async execute<TResult>(
    script: (...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    return this.adaptee.executeScript<TResult>(script, ...args);
  }

  public async findElements(
    selector: string,
    parent?: WebElement
  ): Promise<WebElement[]> {
    const parentElement = parent && (parent as SeleniumWebElement).adaptee;

    return (await (parentElement || this.adaptee).findElements(
      selenium.By.css(selector)
    )).map(element => new SeleniumWebElement(element));
  }

  public async navigateTo(url: string): Promise<void> {
    return this.adaptee.navigate().to(url);
  }

  public async press(key: Key): Promise<void> {
    let seleniumKey: string;

    switch (key) {
      case 'Enter': {
        seleniumKey = selenium.Key.ENTER;
        break;
      }
      case 'Escape': {
        seleniumKey = selenium.Key.ESCAPE;
        break;
      }
      case 'Tab': {
        seleniumKey = selenium.Key.TAB;
        break;
      }
      default: {
        seleniumKey = key;
      }
    }

    return (this.adaptee as WebDriver4)
      .actions({bridge: true})
      .sendKeys(seleniumKey)
      .perform();
  }
}
