import {StandardFinder} from '@pageobject/standard';
import {describeTests, url} from '@pageobject/standard-test';
import {Browser, launch} from 'puppeteer';
import {createFinder} from '.';

let browser: Browser;
let finder: StandardFinder;

beforeAll(async () => {
  browser = await launch();

  const page = await browser.newPage();

  finder = createFinder(page);

  await page.goto(url);
});

afterAll(async () => {
  await browser.close();
});

describeTests(() => finder);
