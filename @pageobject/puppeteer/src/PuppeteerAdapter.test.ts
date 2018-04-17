import {WebAdapterTest} from '@pageobject/web';
import {PuppeteerAdapter} from '.';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

const args =
  process.env.CI === 'true'
    ? ['--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox']
    : [];

describe('PuppeteerAdapter', () => {
  it('should pass the WebAdapterTest successfully', async () => {
    await new WebAdapterTest(await PuppeteerAdapter.create({args})).run();
  });
});
