import {WebAdapterTest} from '@pageobject/web';
import getPort from 'get-port';
import {SeleniumAdapter} from '..';
import {ChromeDriver} from './ChromeDriver';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

const args =
  process.env.CI === 'true'
    ? [
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox'
      ]
    : ['--headless', '--disable-gpu'];

describe('SeleniumAdapter', () => {
  const chromeDriver = new ChromeDriver();

  beforeAll(async () => {
    await chromeDriver.start(await getPort());
  });

  afterAll(() => {
    chromeDriver.stop();
  });

  it('should pass the WebAdapterTest successfully', async () => {
    await new WebAdapterTest(
      await SeleniumAdapter.create({
        browserName: 'chrome',
        chromeOptions: {args}
      })
    ).run();
  });
});
