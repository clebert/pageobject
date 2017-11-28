import {AdapterTestSuite} from '@pageobject/class';
import {ElementHandle} from 'puppeteer';
import {PuppeteerAdapter} from '..';

class PuppeteerAdapterTestSuite extends AdapterTestSuite<
  ElementHandle,
  PuppeteerAdapter
> {
  public async setUp(url: string): Promise<PuppeteerAdapter> {
    const adapter = await PuppeteerAdapter.launchChrome();

    await adapter.page.goto(url);

    return adapter;
  }

  public async tearDown(adapter: PuppeteerAdapter): Promise<void> {
    await adapter.browser.close();
  }
}

describe('PuppeteerAdapter', () => {
  it('should pass the test suite', async () => {
    const testSuite = new PuppeteerAdapterTestSuite();

    await testSuite.runTests();
  });
});
