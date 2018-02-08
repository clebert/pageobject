import {describePageTests, testURL} from '@pageobject/standard-test';
import {launch} from 'puppeteer';
import {PuppeteerPage} from '.';

let page: PuppeteerPage;

beforeAll(async () => {
  page = await PuppeteerPage.load(testURL, await launch());
});

afterAll(async () => {
  await page.browser.close();
});

beforeEach(async () => {
  await page.adaptee.reload();
});

describePageTests(() => page);
