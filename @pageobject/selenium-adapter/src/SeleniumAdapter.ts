import {Adapter, PageClass, PageObject} from '@pageobject/class';
import {
  Builder,
  By,
  Capabilities,
  WebDriver,
  WebElement
} from 'selenium-webdriver';

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

  public async open<TPage extends PageObject<WebElement, SeleniumAdapter>>(
    Page: PageClass<WebElement, SeleniumAdapter, TPage>,
    url: string
  ): Promise<TPage> {
    await this.driver.navigate().to(url);

    return PageObject.goto(Page, this as SeleniumAdapter);
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
}
