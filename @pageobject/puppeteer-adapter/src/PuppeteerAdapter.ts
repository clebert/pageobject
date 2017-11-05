import {Adapter, PageClass, PageObject} from '@pageobject/class';
import {
  Browser,
  ElementHandle,
  LaunchOptions,
  NavigationOptions,
  Page,
  launch
} from 'puppeteer';

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

  public async open<TPage extends PageObject<ElementHandle, PuppeteerAdapter>>(
    /* tslint:disable-next-line no-shadowed-variable */
    Page: PageClass<ElementHandle, PuppeteerAdapter, TPage>,
    url: string,
    options?: Partial<NavigationOptions>
  ): Promise<TPage> {
    await this.page.goto(url);

    return PageObject.goto(Page, this as PuppeteerAdapter);
  }

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

  public async getCurrentUrl(): Promise<string> {
    const urlHandle = await this.page.evaluateHandle(
      /* istanbul ignore next */
      () => window.location.href
    );

    const url: string = await urlHandle.jsonValue();

    await urlHandle.dispose();

    return url;
  }
}
