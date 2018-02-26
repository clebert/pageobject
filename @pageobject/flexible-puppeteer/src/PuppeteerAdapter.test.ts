import {FlexibleAdapterTestSuite} from '@pageobject/flexible';
import {PuppeteerAdapter} from '.';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

test('PuppeteerAdapter', async () => {
  const adapter = await PuppeteerAdapter.create();

  try {
    const testSuite = new FlexibleAdapterTestSuite(adapter);

    await testSuite.testAll();
  } finally {
    await adapter.browser.close();
  }
});
