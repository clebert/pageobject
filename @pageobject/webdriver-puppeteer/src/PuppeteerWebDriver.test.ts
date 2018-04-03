// tslint:disable no-any

import {WebDriverTest} from '@pageobject/web';
import {NavigationOptions} from 'puppeteer';
import {PuppeteerWebDriver} from '.';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('PuppeteerWebDriver', () => {
  it('should pass the WebDriverTest successfully', async () => {
    const driver = await PuppeteerWebDriver.create();

    try {
      await new WebDriverTest(driver).testAll();
    } finally {
      await driver.browser.close();
    }
  });

  describe('navigateTo()', () => {
    const navigationOptions: NavigationOptions = {waitUntil: 'load'};

    it('should use the specified navigation options', async () => {
      const goto = jest.fn();

      const driver = new PuppeteerWebDriver(
        {} as any,
        {goto} as any,
        navigationOptions
      );

      await driver.navigateTo('about:blank');

      expect(goto).toHaveBeenCalledTimes(1);
      expect(goto).toHaveBeenCalledWith('about:blank', navigationOptions);
    });

    it('should use the statically specified navigation options', async () => {
      const driver = await PuppeteerWebDriver.create({}, navigationOptions);
      const goto = jest.spyOn(driver.page, 'goto');

      await driver.navigateTo('about:blank');

      expect(goto).toHaveBeenCalledTimes(1);
      expect(goto).toHaveBeenCalledWith('about:blank', navigationOptions);
    });

    it('should not use any navigation options', async () => {
      const goto = jest.fn();
      const driver = new PuppeteerWebDriver({} as any, {goto} as any);

      await driver.navigateTo('about:blank');

      expect(goto).toHaveBeenCalledTimes(1);
      expect(goto).toHaveBeenCalledWith('about:blank', undefined);
    });
  });
});
