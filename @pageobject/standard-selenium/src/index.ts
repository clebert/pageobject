import {StandardElement, StandardFinder} from '@pageobject/standard';
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

  public async type(text: string): Promise<void> {
    for (const character of text.split('')) {
      await this.adaptee.sendKeys(character);
      await new Promise<void>(resolve => setTimeout(resolve, 100));
    }
  }

  public async getAttribute(name: string): Promise<string | undefined> {
    const value = await this.adaptee.getDriver().executeScript<string | null>(
      /* istanbul ignore next */
      (_element: HTMLElement, _name: string) => _element.getAttribute(_name),
      this.adaptee,
      name
    );

    return value ? value.trim() : undefined;
  }

  public async getHTML(): Promise<string> {
    return this.adaptee.getDriver().executeScript<string>(
      /* istanbul ignore next */
      (_element: HTMLElement) => _element.outerHTML,
      this.adaptee
    );
  }

  public async getProperty<TValue>(name: string): Promise<TValue | undefined> {
    return this.adaptee.getDriver().executeScript<TValue | undefined>(
      /* istanbul ignore next */
      (_element: HTMLElement, _name: keyof HTMLElement) => _element[_name],
      this.adaptee,
      name
    );
  }

  public async getTagName(): Promise<string> {
    return this.adaptee.getTagName();
  }

  public async getText(): Promise<string> {
    return this.adaptee.getText();
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
