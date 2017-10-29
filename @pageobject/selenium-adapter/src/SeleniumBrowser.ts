import {PageClass, PageObject} from '@pageobject/class';
import {Builder, Capabilities, WebElement} from 'selenium-webdriver';
import {SeleniumAdapter} from './SeleniumAdapter';

export class SeleniumBrowser {
  public static async launchHeadlessChrome(): Promise<SeleniumBrowser> {
    const capabilities = Capabilities.chrome().set('chromeOptions', {
      args: ['--headless', '--disable-gpu']
    });

    /* tslint:disable-next-line await-promise */
    const driver = await new Builder().withCapabilities(capabilities).build();

    return new SeleniumBrowser(new SeleniumAdapter(driver));
  }

  public readonly adapter: SeleniumAdapter;

  public constructor(adapter: SeleniumAdapter) {
    this.adapter = adapter;
  }

  public async open<TPage extends PageObject<WebElement, SeleniumAdapter>>(
    Page: PageClass<WebElement, SeleniumAdapter, TPage>,
    url: string
  ): Promise<TPage> {
    await this.adapter.driver.navigate().to(url);

    return PageObject.goto(Page, this.adapter);
  }

  public async quit(): Promise<void> {
    await this.adapter.driver.quit();
  }

  public async setElementSearchTimeout(ms: number): Promise<void> {
    await this.adapter.driver
      .manage()
      .timeouts()
      .implicitlyWait(ms);
  }

  public async setPageLoadTimeout(ms: number): Promise<void> {
    await this.adapter.driver
      .manage()
      .timeouts()
      .pageLoadTimeout(ms);
  }
}
