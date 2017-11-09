/* tslint:disable-next-line no-implicit-dependencies no-import-side-effect */
import 'chromedriver';

import {AdapterTestSuite, PageObject} from '@pageobject/class';
import {WebElement} from 'selenium-webdriver';
import {SeleniumAdapter} from '..';

class TestPage extends PageObject<WebElement, SeleniumAdapter> {
  public static selectors: string[];
  public static url: RegExp;
}

class SeleniumAdapterTestSuite extends AdapterTestSuite<
  WebElement,
  SeleniumAdapter
> {
  public async open(url: string): Promise<SeleniumAdapter> {
    const adapter = await SeleniumAdapter.launchHeadlessChrome();

    TestPage.selectors = this.initialSelectors;
    TestPage.url = this.urlPattern;

    await adapter.open(TestPage, url);

    return adapter;
  }

  public async quit(adapter: SeleniumAdapter): Promise<void> {
    await adapter.driver.quit();
  }
}

describe('SeleniumAdapter', () => {
  it('should pass the test suite', async () => {
    const testSuite = new SeleniumAdapterTestSuite();

    await testSuite.runTests();
  });
});
