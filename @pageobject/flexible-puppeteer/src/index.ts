import {
  FlexibleElement,
  FlexibleKey,
  FlexiblePage,
  Script
} from '@pageobject/flexible';
import {Browser, ElementHandle, Page} from 'puppeteer';

class PuppeteerElement implements FlexibleElement {
  public readonly adaptee: ElementHandle;

  private readonly _page: Page;

  public constructor(adaptee: ElementHandle, page: Page) {
    this.adaptee = adaptee;
    this._page = page;
  }

  public async click(): Promise<void> {
    return this.adaptee.click();
  }

  public async doubleClick(): Promise<void> {
    await this.adaptee.click();
    await this.adaptee.click({clickCount: 2});
  }

  public async execute<TElement extends Element, TResult>(
    script: Script<TElement, TResult>,
    ...args: any[] /* tslint:disable-line no-any */
  ): Promise<TResult> {
    return this._page.evaluate(script, this.adaptee, ...args);
  }

  public async sendCharacter(character: string): Promise<void> {
    if (character.length !== 1) {
      throw new Error('Invalid character');
    }

    await this._focus();

    return this._page.keyboard.sendCharacter(character);
  }

  public async sendKey(key: FlexibleKey): Promise<void> {
    await this._focus();

    switch (key) {
      case FlexibleKey.ENTER:
        return this._page.keyboard.press('Enter');
      case FlexibleKey.ESCAPE:
        return this._page.keyboard.press('Escape');
      case FlexibleKey.TAB: {
        return this._page.keyboard.press('Tab');
      }
    }
  }

  private async _focus(): Promise<void> {
    await this.execute(
      /* istanbul ignore next */ (_element: HTMLElement) => _element.focus()
    );
  }
}

export class PuppeteerPage implements FlexiblePage {
  public static async load(
    url: string,
    browser: Browser
  ): Promise<PuppeteerPage> {
    const page = new PuppeteerPage(await browser.newPage(), browser);

    await page.adaptee.goto(url);

    return page;
  }

  public readonly adaptee: Page;
  public readonly browser: Browser;

  public constructor(adaptee: Page, browser: Browser) {
    this.adaptee = adaptee;
    this.browser = browser;
  }

  public async findElements(
    selector: string,
    parent?: FlexibleElement
  ): Promise<FlexibleElement[]> {
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
