/* tslint:disable-next-line no-implicit-dependencies no-import-side-effect */
import 'chromedriver';

import {join} from 'path';
import {SeleniumBrowser} from '..';

const url = `file://${join(__dirname, 'index.html')}`;

let browser: SeleniumBrowser;

beforeEach(async () => {
  browser = await SeleniumBrowser.launchHeadlessChrome();

  await browser.adapter.driver.navigate().to(url);
});

afterEach(async () => {
  await browser.quit();
});

describe('SeleniumAdapter', () => {
  describe('findElements(selector, parent?)', () => {
    it('should return all <p> elements', async () => {
      const elements = await browser.adapter.findElements('p');

      expect(elements).toHaveLength(2);

      expect(await elements[0].getText()).toBe('Foo');
      expect(await elements[1].getText()).toBe('Bar');
    });

    it('should return only the descendant <p> element of #bar', async () => {
      const container = (await browser.adapter.findElements('#bar'))[0];
      const elements = await browser.adapter.findElements('p', container);

      expect(elements).toHaveLength(1);

      expect(await elements[0].getText()).toBe('Bar');
    });

    it('should return no elements', async () => {
      const elements = await browser.adapter.findElements('.undefined');

      expect(elements).toHaveLength(0);
    });
  });

  describe('getCurrentUrl()', () => {
    it('should return the initial url', async () => {
      expect(await browser.adapter.getCurrentUrl()).toBe(url);
    });

    it('should return a manipulated url', async () => {
      const manipulatedUrl = `${url}?foo=bar`;

      await browser.adapter.driver.executeScript<void>((_url: string) => {
        window.history.pushState({}, 'Test', _url);
      }, manipulatedUrl);

      expect(await browser.adapter.getCurrentUrl()).toBe(manipulatedUrl);
    });
  });
});
