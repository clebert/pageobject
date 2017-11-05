import {join} from 'path';
import {PuppeteerAdapter, predicates} from '..';
import {IndexPage} from '../__fixtures__/IndexPage';

const url = `file://${join(__dirname, '../__fixtures__/index.html')}`;

let adapter: PuppeteerAdapter;

beforeEach(async () => {
  adapter = await PuppeteerAdapter.launchChrome();

  await adapter.open(IndexPage, url);
});

afterEach(async () => {
  await adapter.browser.close();
});

describe('SeleniumAdapter', () => {
  describe('public this.findElements(selector, parent?)', () => {
    it('should return all <p> elements', async () => {
      const elements = await adapter.findElements('p');

      expect(elements).toHaveLength(2);

      expect(
        await predicates.textEquals('Foo')(adapter, elements[0], 0, elements)
      ).toBe(true);

      expect(
        await predicates.textEquals('Bar')(adapter, elements[1], 1, elements)
      ).toBe(true);
    });

    it('should return only the descendant <p> element of #bar', async () => {
      const container = (await adapter.findElements('#bar'))[0];
      const elements = await adapter.findElements('p', container);

      expect(elements).toHaveLength(1);

      expect(
        await predicates.textEquals('Bar')(adapter, elements[0], 0, elements)
      ).toBe(true);
    });

    it('should return no elements', async () => {
      const elements = await adapter.findElements('.undefined');

      expect(elements).toHaveLength(0);
    });
  });

  describe('public this.getCurrentUrl()', () => {
    it('should return the initial url', async () => {
      expect(await adapter.getCurrentUrl()).toBe(url);
    });

    it('should return a manipulated url', async () => {
      const manipulatedUrl = `${url}?foo=bar`;

      await adapter.page.evaluate((_url: string) => {
        window.history.pushState({}, 'Test', _url);
      }, manipulatedUrl);

      expect(await adapter.getCurrentUrl()).toBe(manipulatedUrl);
    });
  });
});
