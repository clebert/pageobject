import {WebDriverTest} from '@pageobject/web';
import {browser} from 'protractor';
import {ProtractorWebDriver} from '.';

describe('ProtractorWebDriver', () => {
  it('should pass the WebDriverTest successfully', async () => {
    await new WebDriverTest(new ProtractorWebDriver(browser)).testAll();
  });
});
