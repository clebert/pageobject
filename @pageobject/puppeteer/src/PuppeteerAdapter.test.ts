import {WebAdapterTest} from '@pageobject/web';
import {PuppeteerAdapter} from '.';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('PuppeteerAdapter', () => {
  it('should pass the WebAdapterTest successfully', async () => {
    const chromeArgs =
      process.env.CI === 'true'
        ? [
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-sandbox'
          ]
        : [];

    await new WebAdapterTest(
      await PuppeteerAdapter.create({args: chromeArgs})
    ).run();
  });
});
