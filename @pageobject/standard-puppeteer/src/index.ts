import {
  StandardAction,
  StandardElement,
  StandardFinder
} from '@pageobject/standard';
import {ElementHandle, Page} from 'puppeteer';

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
 * `import {createFinder} from '@pageobject/standard-puppeteer';`
 */
export function createFinder(page: Page): StandardFinder {
  return async (selector, parent) => {
    if (parent && !(parent instanceof PuppeteerElement)) {
      throw new Error('Incompatible parent element');
    }

    const elementsHandle = await page.evaluateHandle(
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

    return elements.map(element => new PuppeteerElement(element, page));
  };
}
