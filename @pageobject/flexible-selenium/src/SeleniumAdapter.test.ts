import {FlexibleAdapterTestSuite} from '@pageobject/flexible';
import {SeleniumAdapter} from '.';
import {ChromeDriver} from './ChromeDriver';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('SeleniumAdapter', () => {
  const chromeDriver = new ChromeDriver();

  beforeAll(async () => {
    await chromeDriver.start(4445);
  });

  afterAll(() => {
    chromeDriver.stop();
  });

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
