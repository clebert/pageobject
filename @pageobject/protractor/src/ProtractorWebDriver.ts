// tslint:disable no-redundant-jsdoc

import {Argument, Key, WebDriver, WebElement} from '@pageobject/web';
import * as protractor from 'protractor';

class ProtractorWebElement implements WebElement {
  public readonly adaptee: protractor.WebElement;

  public constructor(adaptee: protractor.WebElement) {
    this.adaptee = adaptee;
  }

  public async click(): Promise<void> {
    return this.adaptee.click();
  }

  public async doubleClick(): Promise<void> {
    return this.adaptee
      .getDriver()
      .actions()
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
export class ProtractorWebDriver implements WebDriver {
  private readonly _browser: protractor.ProtractorBrowser;

  /**
   * @param browser https://www.protractortest.org/#/api?view=ProtractorBrowser
   */
  public constructor(browser: protractor.ProtractorBrowser) {
    this._browser = browser;
  }

  public async execute<TResult>(
    script: (...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    return this._browser.driver.executeScript<TResult>(script, ...args);
  }

  public async findElements(
    selector: string,
    parent?: WebElement
  ): Promise<WebElement[]> {
    const parentElement = parent && (parent as ProtractorWebElement).adaptee;

    return (await (parentElement || this._browser.driver).findElements(
      protractor.By.css(selector)
    )).map(element => new ProtractorWebElement(element));
  }

  public async navigateTo(url: string): Promise<void> {
    return this._browser.driver.navigate().to(url);
  }

  public async press(key: Key): Promise<void> {
    let protractorKey: string;

    switch (key) {
      case 'Enter': {
        protractorKey = protractor.Key.ENTER;
        break;
      }
      case 'Escape': {
        protractorKey = protractor.Key.ESCAPE;
        break;
      }
      case 'Tab': {
        protractorKey = protractor.Key.TAB;
        break;
      }
      default: {
        protractorKey = key;
      }
    }

    return this._browser.driver
      .actions()
      .sendKeys(protractorKey)
      .perform();
  }

  public async quit(): Promise<void> {
    return;
  }
}
