// tslint:disable no-redundant-jsdoc

import {Argument, Key, WebDriver, WebElement} from '@pageobject/web';
import {
  Browser,
  ElementHandle,
  LaunchOptions,
  NavigationOptions,
  Page,
  launch
} from 'puppeteer';

class PuppeteerWebElement implements WebElement {
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
 * @implements https://pageobject.js.org/api/web/interfaces/webdriver.html
 */
export class PuppeteerWebDriver implements WebDriver {
  /**
   * @param launchOptions https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
   * @param navigationOptions https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options
   */
  public static async create(
    launchOptions?: LaunchOptions,
    navigationOptions?: NavigationOptions
  ): Promise<PuppeteerWebDriver> {
    const browser = await launch(launchOptions);

    return new PuppeteerWebDriver(
      browser,
      await browser.newPage(),
      navigationOptions
    );
  }

  private readonly _browser: Browser;
  private readonly _navigationOptions?: NavigationOptions;
  private readonly _page: Page;

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
    this._browser = browser;
    this._navigationOptions = navigationOptions;
    this._page = page;
  }

  public async execute<TResult>(
    script: (...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    return this._page.evaluate(script, ...args);
  }

  public async findElements(
    selector: string,
    parent?: WebElement
  ): Promise<WebElement[]> {
    const elementsHandle = await this._page.evaluateHandle(
      // istanbul ignore next
      (_selector: string, _parent: Element | undefined) =>
        (_parent || document).querySelectorAll(_selector),
      selector,
      parent && (parent as PuppeteerWebElement).adaptee
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

    return elements.map(
      element => new PuppeteerWebElement(element, this._page)
    );
  }

  public async navigateTo(url: string): Promise<void> {
    await this._page.goto(url, this._navigationOptions);
  }

  public async press(key: Key): Promise<void> {
    return this._page.keyboard.press(key);
  }

  public async quit(): Promise<void> {
    return this._browser.close();
  }
}
