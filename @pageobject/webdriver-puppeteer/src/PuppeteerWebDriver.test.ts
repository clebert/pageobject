import {WebDriverTest} from '@pageobject/web';
import {PuppeteerWebDriver} from '.';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('PuppeteerWebDriver', () => {
  it('should pass the WebDriverTest successfully', async () => {
    const chromeArgs =
      process.env.CI === 'true'
        ? [
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-sandbox'
          ]
        : [];

    await new WebDriverTest(
      await PuppeteerWebDriver.create({args: chromeArgs})
    ).run();
  });
});
