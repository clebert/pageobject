import {PageClass, PageObject} from '@pageobject/class';
import {Builder, Capabilities, WebDriver, WebElement} from 'selenium-webdriver';
import {SeleniumAdapter} from './SeleniumAdapter';

export class SeleniumBrowser {
  public static async launch(
    capabilities: Capabilities
  ): Promise<SeleniumBrowser> {
    /* tslint:disable-next-line await-promise */
    const driver = await new Builder().withCapabilities(capabilities).build();
    const adapter = new SeleniumAdapter(driver);

    return new SeleniumBrowser(driver, adapter);
  }

  public static async launchHeadlessChrome(): Promise<SeleniumBrowser> {
    const capabilities = Capabilities.chrome().set('chromeOptions', {
      args: ['--headless', '--disable-gpu']
    });

    return SeleniumBrowser.launch(capabilities);
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

    return PageObject.waitFor(Page, this.adapter);
  }

  public async quit(): Promise<void> {
    await this.driver.quit();
  }
}
