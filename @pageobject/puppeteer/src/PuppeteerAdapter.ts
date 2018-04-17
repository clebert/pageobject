// tslint:disable no-redundant-jsdoc

import {Argument, Key, WebAdapter, WebNode} from '@pageobject/web';
import {
  Browser,
  ElementHandle,
  LaunchOptions,
  NavigationOptions,
  Page,
  launch
} from 'puppeteer';

class PuppeteerNode implements WebNode {
  public readonly elementHandle: ElementHandle;
  public readonly page: Page;

  public constructor(elementHandle: ElementHandle, page: Page) {
    this.elementHandle = elementHandle;
    this.page = page;
  }

  public async click(): Promise<void> {
    return this.elementHandle.click();
  }

  public async doubleClick(): Promise<void> {
    await this.elementHandle.click();
    await this.elementHandle.click({clickCount: 2});
  }

  public async execute<THTMLElement extends HTMLElement, TResult>(
    script: (element: THTMLElement, ...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    return this.page.evaluate(script, this.elementHandle, ...args);
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
  public readonly navigationOptions?: NavigationOptions;

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
    this.navigationOptions = navigationOptions;
  }

  public async execute<TResult>(
    script: (...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    return this.page.evaluate(script, ...args);
  }

  public async findNodes(
    selector: string,
    ancestor?: WebNode
  ): Promise<WebNode[]> {
    const elementsHandle = await this.page.evaluateHandle(
      // istanbul ignore next
      (_selector: string, _ancestor: Element | undefined) =>
        (_ancestor || document).querySelectorAll(_selector),
      selector,
      ancestor && (ancestor as PuppeteerNode).elementHandle
    );

    const lengthHandle = await elementsHandle.getProperty('length');
    const length: number = await lengthHandle.jsonValue();

    await lengthHandle.dispose();

    const elementHandles: ElementHandle[] = [];

    for (let i = 0; i < length; i += 1) {
      const elementHandle = (await elementsHandle.getProperty(
        String(i)
      )).asElement();

      // istanbul ignore next
      if (!elementHandle) {
        throw new Error('Unable to get element handle');
      }

      elementHandles.push(elementHandle);
    }

    await elementsHandle.dispose();

    return elementHandles.map(
      elementHandle => new PuppeteerNode(elementHandle, this.page)
    );
  }

  public async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, this.navigationOptions);
  }

  public async press(key: Key): Promise<void> {
    return this.page.keyboard.press(key);
  }

  public async quit(): Promise<void> {
    return this.browser.close();
  }
}
