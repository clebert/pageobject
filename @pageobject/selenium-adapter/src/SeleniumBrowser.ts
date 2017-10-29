import {PageClass, PageObject} from '@pageobject/class';
import {Builder, Capabilities, WebDriver, WebElement} from 'selenium-webdriver';
import {SeleniumAdapter} from './SeleniumAdapter';

export class SeleniumBrowser {
  public static async launchHeadlessChrome(): Promise<SeleniumBrowser> {
    const capabilities = Capabilities.chrome().set('chromeOptions', {
      args: ['--headless', '--disable-gpu']
    });

    /* tslint:disable-next-line await-promise */
    const driver = await new Builder().withCapabilities(capabilities).build();

    return new SeleniumBrowser(driver, new SeleniumAdapter(driver));
  }

  public readonly adapter: SeleniumAdapter;

  private readonly driver: WebDriver;

  public constructor(driver: WebDriver, adapter: SeleniumAdapter) {
    this.driver = driver;
    this.adapter = adapter;
  }

  public async open<TPage extends PageObject<WebElement, SeleniumAdapter>>(
    Page: PageClass<WebElement, SeleniumAdapter, TPage>,
    url: string
  ): Promise<TPage> {
    await this.driver.navigate().to(url);

    return PageObject.goto(Page, this.adapter);
  }

  public async quit(): Promise<void> {
    await this.driver.quit();
  }
}
