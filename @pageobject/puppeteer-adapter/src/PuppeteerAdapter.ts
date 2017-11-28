import {Adapter} from '@pageobject/class';
import {Browser, ElementHandle, LaunchOptions, Page, launch} from 'puppeteer';

export class PuppeteerAdapter implements Adapter<ElementHandle> {
  public static async launchChrome(
    options?: LaunchOptions
  ): Promise<PuppeteerAdapter> {
    const browser = await launch(options);
    const page = await browser.newPage();

    return new PuppeteerAdapter(browser, page);
  }

  public readonly browser: Browser;
  public readonly page: Page;

  public constructor(browser: Browser, page: Page) {
    this.browser = browser;
    this.page = page;
  }

  public async click(element: ElementHandle): Promise<void> {
    await element.click();
  }

  /* tslint:disable no-any */
  public async evaluate<TResult>(
    script: (...args: any[]) => TResult,
    ...args: any[]
  ): Promise<TResult> {
    return this.page.evaluate(script, ...args);
  }
  /* tslint:enable no-any */

  public async findElements(
    selector: string,
    parent?: ElementHandle
  ): Promise<ElementHandle[]> {
    const elementsHandle = await this.page.evaluateHandle(
      /* istanbul ignore next */
      (_selector: string, _parent: Element | undefined) =>
        (_parent || document).querySelectorAll(_selector),
      selector,
      parent
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

    return elements;
  }

  public async type(
    element: ElementHandle,
    text: string,
    delay: number
  ): Promise<void> {
    await element.type(text, {delay});
  }
}
