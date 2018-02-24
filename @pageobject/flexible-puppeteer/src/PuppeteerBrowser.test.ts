import {FlexibleTestSuite} from '@pageobject/flexible';
import {PuppeteerBrowser} from '.';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

test('PuppeteerBrowser', async () => {
  const browser = await PuppeteerBrowser.open();

  try {
    const testSuite = new FlexibleTestSuite(browser);

    await testSuite.testAll();
  } finally {
    await browser.adaptee.close();
  }
});
