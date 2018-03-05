import {
  FlexibleAdapter,
  FlexibleElement,
  FlexibleKey,
  Script
} from '@pageobject/flexible';
import {Key, ProtractorBrowser, WebElement} from 'protractor';

class ProtractorElement implements FlexibleElement {
  public readonly adaptee: WebElement;

  public constructor(adaptee: WebElement) {
    this.adaptee = adaptee;
  }

  public async click(): Promise<void> {
    return this.adaptee.click();
  }

  public async doubleClick(): Promise<void> {
    const driver = this.adaptee.getDriver();

    return driver
      .actions()
      .doubleClick(this.adaptee)
      .perform();
  }

  public async execute<TElement extends Element, TResult>(
    script: Script<TElement, TResult>,
    ...args: any[] /* tslint:disable-line no-any */
  ): Promise<TResult> {
    return this.adaptee
      .getDriver()
      .executeScript<TResult>(script, this.adaptee, ...args);
  }

  public async sendCharacter(character: string): Promise<void> {
    if (character.length !== 1) {
      throw new Error('Invalid character');
    }

    return this.adaptee.sendKeys(character);
  }

  public async sendKey(key: FlexibleKey): Promise<void> {
    switch (key) {
      case FlexibleKey.ENTER:
        return this.adaptee.sendKeys(Key.ENTER);
      case FlexibleKey.ESCAPE:
        return this.adaptee.sendKeys(Key.ESCAPE);
      case FlexibleKey.TAB: {
        return this.adaptee.sendKeys(Key.TAB);
      }
    }
  }
}

export class ProtractorAdapter implements FlexibleAdapter {
  public browser: ProtractorBrowser;

  public constructor(browser: ProtractorBrowser) {
    this.browser = browser;
  }

  public async findElements(
    selector: string,
    parent?: FlexibleElement
  ): Promise<FlexibleElement[]> {
    if (parent && !(parent instanceof ProtractorElement)) {
      throw new Error('Incompatible parent element');
    }

    const {driver} = this.browser;

    return (await ((parent && parent.adaptee) || driver).findElements(
      ProtractorBrowser.By.css(selector)
    )).map(element => new ProtractorElement(element));
  }

  public async navigateTo(url: string): Promise<void> {
    await this.browser.driver.navigate().to(url);
  }
}
