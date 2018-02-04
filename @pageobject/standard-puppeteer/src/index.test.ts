import {describePageTests, url} from '@pageobject/standard-test';
import {launch} from 'puppeteer';
import {PuppeteerPage} from '.';

let page: PuppeteerPage;

beforeAll(async () => {
  page = await PuppeteerPage.load(url, await launch());
});

afterAll(async () => {
  await page.browser.close();
});

describePageTests(() => page);
