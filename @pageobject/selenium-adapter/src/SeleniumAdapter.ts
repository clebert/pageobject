import {Adapter} from '@pageobject/class';
import {
  Builder,
  By,
  Capabilities,
  WebDriver,
  WebElement,
  promise
} from 'selenium-webdriver';

/* https://github.com/SeleniumHQ/selenium/issues/2969#issuecomment-307917606 */
promise.USE_PROMISE_MANAGER = false;

export class SeleniumAdapter implements Adapter<WebElement> {
  public static async launchHeadlessChrome(): Promise<SeleniumAdapter> {
    const capabilities = Capabilities.chrome().set('chromeOptions', {
      args: ['--headless', '--disable-gpu']
    });

    /* tslint:disable-next-line await-promise */
    const driver = await new Builder().withCapabilities(capabilities).build();

    return new SeleniumAdapter(driver);
  }

  public readonly driver: WebDriver;

  public constructor(driver: WebDriver) {
    this.driver = driver;
  }

  public async click(element: WebElement): Promise<void> {
    await element.click();
  }

  /* tslint:disable no-any */
  public async evaluate<TResult>(
    script: (...args: any[]) => TResult,
    ...args: any[]
  ): Promise<TResult> {
    return this.driver.executeScript<TResult>(script, ...args);
  }
  /* tslint:enable no-any */

  public async findElements(
    selector: string,
    parent?: WebElement
  ): Promise<WebElement[]> {
    return (parent || this.driver).findElements(By.css(selector));
  }

  public async open(url: string): Promise<void> {
    await this.driver.navigate().to(url);
  }

  public async quit(): Promise<void> {
    await this.driver.quit();
  }
}
