/* tslint:disable no-any */

import {FlexibleAdapterTestSuite} from '@pageobject/flexible';
import {NavigationOptions} from 'puppeteer';
import {PuppeteerAdapter} from '.';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('PuppeteerAdapter', () => {
  let adapter: PuppeteerAdapter;

  afterEach(async () => {
    if (adapter.browser.close) {
      await adapter.browser.close();
    }
  });

  it('should pass the FlexibleAdapterTestSuite successfully', async () => {
    adapter = await PuppeteerAdapter.create();

    const testSuite = new FlexibleAdapterTestSuite(adapter);

    await testSuite.testAll();
  });

  describe('navigateTo()', () => {
    const navigationOptions: NavigationOptions = {waitUntil: 'load'};

    it('should use the navigation options specified by the constructor', async () => {
      const goto = jest.fn();

      adapter = new PuppeteerAdapter(
        {} as any,
        {goto} as any,
        navigationOptions
      );

      await adapter.navigateTo('about:blank');

      expect(goto).toHaveBeenCalledTimes(1);
      expect(goto).toHaveBeenCalledWith('about:blank', navigationOptions);
    });

    it('should not use any navigation options if they are not specified by the constructor', async () => {
      const goto = jest.fn();

      adapter = new PuppeteerAdapter({} as any, {goto} as any);

      await adapter.navigateTo('about:blank');

      expect(goto).toHaveBeenCalledTimes(1);
      expect(goto).toHaveBeenCalledWith('about:blank', undefined);
    });

    it('should use the navigation options specified by the static initializer', async () => {
      adapter = await PuppeteerAdapter.create({}, navigationOptions);
      const goto = jest.spyOn(adapter.page, 'goto');

      await adapter.navigateTo('about:blank');

      expect(goto).toHaveBeenCalledTimes(1);
      expect(goto).toHaveBeenCalledWith('about:blank', navigationOptions);
    });

    it('should not use any navigation options if they are not specified by the static initializer', async () => {
      adapter = await PuppeteerAdapter.create();
      const goto = jest.spyOn(adapter.page, 'goto');

      await adapter.navigateTo('about:blank');

      expect(goto).toHaveBeenCalledTimes(1);
      expect(goto).toHaveBeenCalledWith('about:blank', undefined);
    });
  });
});
