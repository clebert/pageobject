// tslint:disable no-redundant-jsdoc

import {Argument, Key, WebAdapter, WebElement} from '@pageobject/web';
import {
  Browser,
  ElementHandle,
  LaunchOptions,
  NavigationOptions,
  Page,
  launch
} from 'puppeteer';

class PuppeteerElement implements WebElement {
  public readonly adaptee: ElementHandle;
  public readonly page: Page;

  public constructor(adaptee: ElementHandle, page: Page) {
    this.adaptee = adaptee;
    this.page = page;
  }

  public async click(): Promise<void> {
    return this.adaptee.click();
  }

  public async doubleClick(): Promise<void> {
    await this.adaptee.click();
    await this.adaptee.click({clickCount: 2});
  }

  public async execute<THTMLElement extends HTMLElement, TResult>(
    script: (element: THTMLElement, ...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    return this.page.evaluate(script, this.adaptee, ...args);
  }
}

/**
 * @implements https://pageobject.js.org/api/web/interfaces/webadapter.html
 */
export class PuppeteerAdapter implements WebAdapter {
  /**
   * @param launchOptions https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
   * @param navigationOptions https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options
   */
  public static async create(
    launchOptions?: LaunchOptions,
    navigationOptions?: NavigationOptions
  ): Promise<PuppeteerAdapter> {
    const browser = await launch(launchOptions);

    return new PuppeteerAdapter(
      browser,
      await browser.newPage(),
      navigationOptions
    );
  }

  public readonly browser: Browser;
  public readonly page: Page;

  private readonly _navigationOptions?: NavigationOptions;

  /**
   * @param browser https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-browser
   * @param page https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page
   * @param navigationOptions https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options
   */
  public constructor(
    browser: Browser,
    page: Page,
    navigationOptions?: NavigationOptions
  ) {
    this.browser = browser;
    this.page = page;

    this._navigationOptions = navigationOptions;
  }

  public async execute<TResult>(
    script: (...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    return this.page.evaluate(script, ...args);
  }

  public async findElements(
    selector: string,
    parent?: WebElement
  ): Promise<WebElement[]> {
    const elementsHandle = await this.page.evaluateHandle(
      // istanbul ignore next
      (_selector: string, _parent: Element | undefined) =>
        (_parent || document).querySelectorAll(_selector),
      selector,
      parent && (parent as PuppeteerElement).adaptee
    );

    const lengthHandle = await elementsHandle.getProperty('length');
    const length: number = await lengthHandle.jsonValue();

    await lengthHandle.dispose();

    const elements: ElementHandle[] = [];

    for (let i = 0; i < length; i += 1) {
      const elementHandle = await elementsHandle.getProperty(String(i));
      const element = elementHandle.asElement();

      // istanbul ignore next
      if (!element) {
        throw new Error('Unable to get element handle');
      }

      elements.push(element);
    }

    await elementsHandle.dispose();

    return elements.map(element => new PuppeteerElement(element, this.page));
  }

  public async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, this._navigationOptions);
  }

  public async press(key: Key): Promise<void> {
    return this.page.keyboard.press(key);
  }

  public async quit(): Promise<void> {
    return this.browser.close();
  }
}
