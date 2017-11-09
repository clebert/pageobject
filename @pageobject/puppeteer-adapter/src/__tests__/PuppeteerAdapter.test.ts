import {AdapterTestSuite, PageObject} from '@pageobject/class';
import {ElementHandle} from 'puppeteer';
import {PuppeteerAdapter} from '..';

class TestPage extends PageObject<ElementHandle, PuppeteerAdapter> {
  public static selectors: string[];
  public static url: RegExp;
}

class PuppeteerAdapterTestSuite extends AdapterTestSuite<
  ElementHandle,
  PuppeteerAdapter
> {
  public async open(url: string): Promise<PuppeteerAdapter> {
    const adapter = await PuppeteerAdapter.launchChrome();

    TestPage.selectors = this.initialSelectors;
    TestPage.url = this.urlPattern;

    await adapter.open(TestPage, url);

    return adapter;
  }

  public async quit(adapter: PuppeteerAdapter): Promise<void> {
    await adapter.browser.close();
  }
}

describe('PuppeteerAdapter', () => {
  it('should pass the test suite', async () => {
    const testSuite = new PuppeteerAdapterTestSuite();

    await testSuite.runTests();
  });
});
