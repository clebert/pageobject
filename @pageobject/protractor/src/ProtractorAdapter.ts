// tslint:disable no-redundant-jsdoc

import {Argument, Key, WebAdapter, WebNode} from '@pageobject/web';
import {
  By,
  Key as ProtractorKey,
  ProtractorBrowser,
  WebElement
} from 'protractor';

class ProtractorNode implements WebNode {
  public readonly element: WebElement;

  public constructor(element: WebElement) {
    this.element = element;
  }

  public async click(): Promise<void> {
    return this.element.click();
  }

  public async doubleClick(): Promise<void> {
    return this.element
      .getDriver()
      .actions()
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
export class ProtractorAdapter implements WebAdapter {
  public readonly browser: ProtractorBrowser;

  /**
   * @param browser https://www.protractortest.org/#/api?view=ProtractorBrowser
   */
  public constructor(browser: ProtractorBrowser) {
    this.browser = browser;
  }

  public async execute<TResult>(
    script: (...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    return this.browser.driver.executeScript<TResult>(script, ...args);
  }

  public async findNodes(
    selector: string,
    ancestor?: WebNode
  ): Promise<WebNode[]> {
    const ancestorElement = ancestor && (ancestor as ProtractorNode).element;

    return (await (ancestorElement || this.browser.driver).findElements(
      By.css(selector)
    )).map(element => new ProtractorNode(element));
  }

  public async goto(url: string): Promise<void> {
    return this.browser.driver.navigate().to(url);
  }

  public async press(key: Key): Promise<void> {
    let protractorKey: string;

    switch (key) {
      case 'Enter': {
        protractorKey = ProtractorKey.ENTER;
        break;
      }
      case 'Escape': {
        protractorKey = ProtractorKey.ESCAPE;
        break;
      }
      case 'Tab': {
        protractorKey = ProtractorKey.TAB;
        break;
      }
      default: {
        protractorKey = key;
      }
    }

    return this.browser.driver
      .actions()
      .sendKeys(protractorKey)
      .perform();
  }

  public async quit(): Promise<void> {
    return;
  }
}
