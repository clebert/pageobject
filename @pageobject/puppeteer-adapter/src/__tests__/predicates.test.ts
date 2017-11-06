/* tslint:disable no-any */

import {Predicate} from '@pageobject/class';
import {join} from 'path';
import {ElementHandle} from 'puppeteer';
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

describe('predicates', () => {
  let predicate: Predicate<ElementHandle, PuppeteerAdapter>;

  describe('atIndex(n)', () => {
    beforeEach(() => {
      predicate = predicates.atIndex(1);
    });

    it('should return a predicate that returns true', async () => {
      expect(await predicate(adapter, {} as any, 1, [])).toBe(true);
    });

    it('should return a predicate that returns false', async () => {
      expect(await predicate(adapter, {} as any, 0, [])).toBe(false);
      expect(await predicate(adapter, {} as any, 2, [])).toBe(false);
    });
  });

  describe('textEquals(value)', () => {
    beforeEach(async () => {
      predicate = predicates.textEquals('Foo');
    });

    it('should return a predicate that returns true', async () => {
      const element = (await adapter.findElements('#foo'))[0];

      expect(await predicate(adapter, element, 0, [])).toBe(true);
      expect(await predicate(adapter, element, 1, [])).toBe(true);
    });

    it('should return a predicate that returns false', async () => {
      const element = (await adapter.findElements('#bar'))[0];

      expect(await predicate(adapter, element, 0, [])).toBe(false);
      expect(await predicate(adapter, element, 1, [])).toBe(false);
    });
  });
});
