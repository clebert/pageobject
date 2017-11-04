/* tslint:disable no-any */

/* tslint:disable-next-line no-implicit-dependencies no-import-side-effect */
import 'chromedriver';

import {Predicate} from '@pageobject/class';
import {join} from 'path';
import {SeleniumAdapter, predicates} from '..';
import {IndexPage} from '../__fixtures__/IndexPage';

const url = `file://${join(__dirname, '../__fixtures__/index.html')}`;

let adapter: SeleniumAdapter;

beforeEach(async () => {
  adapter = await SeleniumAdapter.launchHeadlessChrome();

  await adapter.open(IndexPage, url);
});

afterEach(async () => {
  await adapter.driver.quit();
});

describe('predicates', () => {
  let predicate: Predicate<any>;

  describe('atIndex(n)', () => {
    beforeEach(() => {
      predicate = predicates.atIndex(1);
    });

    it('should return a predicate that returns true', async () => {
      expect(await predicate(undefined, 1, [])).toBe(true);
    });

    it('should return a predicate that returns false', async () => {
      expect(await predicate(undefined, 0, [])).toBe(false);
      expect(await predicate(undefined, 2, [])).toBe(false);
    });
  });

  describe('textEquals(value)', () => {
    beforeEach(async () => {
      predicate = predicates.textEquals('Foo');
    });

    it('should return a predicate that returns true', async () => {
      const element = (await adapter.findElements('#foo'))[0];

      expect(await predicate(element, 0, [])).toBe(true);
      expect(await predicate(element, 1, [])).toBe(true);
    });

    it('should return a predicate that returns false', async () => {
      const element = (await adapter.findElements('#bar'))[0];

      expect(await predicate(element, 0, [])).toBe(false);
      expect(await predicate(element, 1, [])).toBe(false);
    });
  });
});
