import 'chromedriver'; /* tslint:disable-line no-import-side-effect */

import {FlexibleTestSuite} from '@pageobject/flexible';
import {SeleniumBrowser} from '.';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

test('SeleniumBrowser', async () => {
  const browser = await SeleniumBrowser.open({
    browserName: 'chrome',
    chromeOptions: {args: ['headless', 'disable-gpu']}
  });

  try {
    const testSuite = new FlexibleTestSuite(browser);

    await testSuite.testAll();
  } finally {
    await browser.driver.quit();
  }
});
