/* tslint:disable-next-line no-implicit-dependencies no-import-side-effect */
import 'chromedriver';

import {AdapterTestSuite} from '@pageobject/adapter-test-suite';
import {WebElement} from 'selenium-webdriver';
import {SeleniumAdapter} from '..';

class SeleniumAdapterTestSuite extends AdapterTestSuite<
  WebElement,
  SeleniumAdapter
> {
  public async setUp(url: string): Promise<SeleniumAdapter> {
    const adapter = await SeleniumAdapter.launchHeadlessChrome();

    await adapter.driver.navigate().to(url);

    return adapter;
  }

  public async tearDown(adapter: SeleniumAdapter): Promise<void> {
    await adapter.driver.quit();
  }
}

describe('SeleniumAdapter', () => {
  it('should pass the adapter test suite', async () => {
    await new SeleniumAdapterTestSuite().run();
  });
});
