import {
  StandardElement,
  StandardElementAction,
  StandardFinder
} from '@pageobject/standard';
import {By, WebDriver, WebElement, promise} from 'selenium-webdriver';

/* https://github.com/SeleniumHQ/selenium/issues/2969#issuecomment-307917606 */
promise.USE_PROMISE_MANAGER = false;

class SeleniumElement implements StandardElement {
  public readonly adaptee: WebElement;

  public constructor(adaptee: WebElement) {
    this.adaptee = adaptee;
  }

  public async click(): Promise<void> {
    return this.adaptee.click();
  }

  public async perform<TElement extends Element, TResult>(
    action: StandardElementAction<TElement, TResult>,
    ...args: any[] /* tslint:disable-line no-any */
  ): Promise<TResult> {
    return this.adaptee
      .getDriver()
      .executeScript<TResult>(action, this.adaptee, ...args);
  }

  public async type(text: string): Promise<void> {
    for (const character of text.split('')) {
      await this.adaptee.sendKeys(character);
      await new Promise<void>(resolve => setTimeout(resolve, 100));
    }
  }

  public async isVisible(): Promise<boolean> {
    return this.adaptee.isDisplayed();
  }
}

/**
 * `import {createFinder} from '@pageobject/standard-selenium';`
 */
export function createFinder(driver: WebDriver): StandardFinder {
  return async (selector, parent) => {
    if (parent && !(parent instanceof SeleniumElement)) {
      throw new Error('Incompatible parent element');
    }

    return (await ((parent && parent.adaptee) || driver).findElements(
      By.css(selector)
    )).map(element => new SeleniumElement(element));
  };
}
