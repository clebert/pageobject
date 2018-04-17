// tslint:disable no-redundant-jsdoc

import {Argument, Key, WebAdapter, WebNode} from '@pageobject/web';
import {
  ActionSequence,
  Builder,
  By,
  Key as SeleniumKey,
  WebDriver,
  WebElement
} from 'selenium-webdriver';

interface WebDriver4 extends WebDriver {
  actions(options?: {bridge: boolean}): ActionSequence;
}

class SeleniumNode implements WebNode {
  public readonly element: WebElement;

  public constructor(element: WebElement) {
    this.element = element;
  }

  public async click(): Promise<void> {
    return this.element.click();
  }

  public async doubleClick(): Promise<void> {
    return (this.element.getDriver() as WebDriver4)
      .actions({bridge: true})
      .doubleClick(this.element)
      .perform();
  }

  public async execute<THTMLElement extends HTMLElement, TResult>(
    script: (element: THTMLElement, ...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    return this.element
      .getDriver()
      .executeScript<TResult>(script, this.element, ...args);
  }
}

/**
 * @implements https://pageobject.js.org/api/web/interfaces/webadapter.html
 */
export class SeleniumAdapter implements WebAdapter {
  /**
   * @param capabilities https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
   */
  public static async create(capabilities: object): Promise<SeleniumAdapter> {
    return new SeleniumAdapter(
      // tslint:disable-next-line await-promise
      await new Builder().withCapabilities(capabilities).build()
    );
  }

  public readonly driver: WebDriver;

  /**
   * @param driver http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html
   */
  public constructor(driver: WebDriver) {
    this.driver = driver;
  }

  public async execute<TResult>(
    script: (...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    return this.driver.executeScript<TResult>(script, ...args);
  }

  public async findNodes(
    selector: string,
    ancestor?: WebNode
  ): Promise<WebNode[]> {
    const ancestorElement = ancestor && (ancestor as SeleniumNode).element;

    return (await (ancestorElement || this.driver).findElements(
      By.css(selector)
    )).map(element => new SeleniumNode(element));
  }

  public async navigateTo(url: string): Promise<void> {
    return this.driver.navigate().to(url);
  }

  public async press(key: Key): Promise<void> {
    let seleniumKey: string;

    switch (key) {
      case 'Enter': {
        seleniumKey = SeleniumKey.ENTER;
        break;
      }
      case 'Escape': {
        seleniumKey = SeleniumKey.ESCAPE;
        break;
      }
      case 'Tab': {
        seleniumKey = SeleniumKey.TAB;
        break;
      }
      default: {
        seleniumKey = key;
      }
    }

    return (this.driver as WebDriver4)
      .actions({bridge: true})
      .sendKeys(seleniumKey)
      .perform();
  }

  public async quit(): Promise<void> {
    return this.driver.quit();
  }
}
