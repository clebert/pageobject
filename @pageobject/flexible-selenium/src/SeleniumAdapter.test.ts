import 'chromedriver'; /* tslint:disable-line no-import-side-effect */

import {FlexibleAdapterTestSuite} from '@pageobject/flexible';
import {SeleniumAdapter} from '.';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('SeleniumAdapter', () => {
  it('should pass the FlexibleAdapterTestSuite successfully', async () => {
    const adapter = await SeleniumAdapter.create({
      browserName: 'chrome',
      chromeOptions: {args: ['headless', 'disable-gpu']}
    });

    try {
      const testSuite = new FlexibleAdapterTestSuite(adapter);

      await testSuite.testAll();
    } finally {
      await adapter.driver.quit();
    }
  });
});
