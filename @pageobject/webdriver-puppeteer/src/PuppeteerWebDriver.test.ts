import {WebDriverTest} from '@pageobject/web';
import {PuppeteerWebDriver} from '.';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('PuppeteerWebDriver', () => {
  it('should pass the WebDriverTest successfully', async () => {
    await new WebDriverTest(await PuppeteerWebDriver.create()).run();
  });
});
