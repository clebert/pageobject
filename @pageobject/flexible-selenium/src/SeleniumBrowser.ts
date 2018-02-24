import {
  FlexibleBrowser,
  FlexibleElement,
  FlexibleKey,
  Script
} from '@pageobject/flexible';
import {
  ActionSequence,
  Builder,
  By,
  Key,
  WebDriver,
  WebElement
} from 'selenium-webdriver';

interface WebDriver4 extends WebDriver {
  actions(options?: {bridge: boolean}): ActionSequence;
}

class SeleniumElement implements FlexibleElement {
  public readonly adaptee: WebElement;

  public constructor(adaptee: WebElement) {
    this.adaptee = adaptee;
  }

  public async click(): Promise<void> {
    return this.adaptee.click();
  }

  public async doubleClick(): Promise<void> {
    const driver: WebDriver4 = this.adaptee.getDriver();

    return driver
      .actions({bridge: true})
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

async function createDriver(capabilities: object): Promise<WebDriver> {
  return new Builder().withCapabilities(capabilities).build();
}

export class SeleniumBrowser implements FlexibleBrowser {
  public static async open(capabilities: object): Promise<SeleniumBrowser> {
    return new SeleniumBrowser(await createDriver(capabilities));
  }

  public readonly driver: WebDriver;

  public constructor(driver: WebDriver) {
    this.driver = driver;
  }

  public async findElements(
    selector: string,
    parent?: FlexibleElement
  ): Promise<FlexibleElement[]> {
    if (parent && !(parent instanceof SeleniumElement)) {
      throw new Error('Incompatible parent element');
    }

    return (await ((parent && parent.adaptee) || this.driver).findElements(
      By.css(selector)
    )).map(element => new SeleniumElement(element));
  }

  public async navigateTo(url: string): Promise<void> {
    await this.driver.navigate().to(url);
  }
}
