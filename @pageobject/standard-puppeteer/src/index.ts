import {
  StandardAction,
  StandardElement,
  StandardPage
} from '@pageobject/standard';
import {Browser, ElementHandle, Page} from 'puppeteer';

class PuppeteerElement implements StandardElement {
  public readonly adaptee: ElementHandle;

  private readonly _page: Page;

  public constructor(adaptee: ElementHandle, page: Page) {
    this.adaptee = adaptee;
    this._page = page;
  }

  public async click(): Promise<void> {
    return this.adaptee.click();
  }

  public async perform<TElement extends Element, TResult>(
    action: StandardAction<TElement, TResult>,
    ...args: any[] /* tslint:disable-line no-any */
  ): Promise<TResult> {
    return this._page.evaluate(action, this.adaptee, ...args);
  }

  public async type(text: string): Promise<void> {
    return this.adaptee.type(text, {delay: 100});
  }
}

/**
 * ```js
 * // ES2015 modules
 * import {PuppeteerPage} from '@pageobject/standard-puppeteer';
 *
 * // CommonJS
 * const {PuppeteerPage} = require('@pageobject/standard-puppeteer');
 * ```
 */
export class PuppeteerPage implements StandardPage {
  /**
   * @param url The URL to navigate to.
   * @param browser An instance of the class [Browser](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-browser).
   */
  public static async load(
    url: string,
    browser: Browser
  ): Promise<PuppeteerPage> {
    const page = new PuppeteerPage(await browser.newPage(), browser);

    await page.adaptee.goto(url);

    return page;
  }

  /**
   * The [Page](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page) instance adapted by this page.
   */
  public readonly adaptee: Page;

  /**
   * The parent [Browser](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-browser) instance for this page.
   */
  public readonly browser: Browser;

  /**
   * @param adaptee An instance of the class [Page](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page).
   * @param browser An instance of the class [Browser](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-browser).
   */
  public constructor(adaptee: Page, browser: Browser) {
    this.adaptee = adaptee;
    this.browser = browser;
  }

  public async findElements(
    selector: string,
    parent?: StandardElement
  ): Promise<StandardElement[]> {
    if (parent && !(parent instanceof PuppeteerElement)) {
      throw new Error('Incompatible parent element');
    }

    const elementsHandle = await this.adaptee.evaluateHandle(
      /* istanbul ignore next */
      (_selector: string, _parent: Element | undefined) =>
        (_parent || document).querySelectorAll(_selector),
      selector,
      parent && parent.adaptee
    );

    const lengthHandle = await elementsHandle.getProperty('length');
    const length: number = await lengthHandle.jsonValue();

    await lengthHandle.dispose();

    const elements: ElementHandle[] = [];

    for (let i = 0; i < length; i += 1) {
      const elementHandle = await elementsHandle.getProperty(String(i));
      const element = elementHandle.asElement();

      /* istanbul ignore next */
      if (!element) {
        throw new Error('Unable to get element handle');
      }

      elements.push(element);
    }

    await elementsHandle.dispose();

    return elements.map(element => new PuppeteerElement(element, this.adaptee));
  }
}
