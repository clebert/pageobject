import {AdapterTestSuite} from '@pageobject/class';
import {ElementHandle} from 'puppeteer';
import {PuppeteerAdapter} from '..';

class PuppeteerAdapterTestSuite extends AdapterTestSuite<
  ElementHandle,
  PuppeteerAdapter
> {
  public async createAdapter(): Promise<PuppeteerAdapter> {
    return PuppeteerAdapter.launchChrome();
  }
}

describe('PuppeteerAdapter', () => {
  it('should pass the test suite', async () => {
    const testSuite = new PuppeteerAdapterTestSuite();

    await testSuite.runTests();
  });
});
