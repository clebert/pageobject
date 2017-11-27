/* tslint:disable-next-line no-implicit-dependencies no-import-side-effect */
import 'chromedriver';

import {AdapterTestSuite} from '@pageobject/class';
import {WebElement} from 'selenium-webdriver';
import {SeleniumAdapter} from '..';

class SeleniumAdapterTestSuite extends AdapterTestSuite<
  WebElement,
  SeleniumAdapter
> {
  public async createAdapter(): Promise<SeleniumAdapter> {
    return SeleniumAdapter.launchHeadlessChrome();
  }
}

describe('SeleniumAdapter', () => {
  it('should pass the test suite', async () => {
    const testSuite = new SeleniumAdapterTestSuite();

    await testSuite.runTests();
  });
});
