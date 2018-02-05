import 'chromedriver'; /* tslint:disable-line no-import-side-effect */

import {describePageTests, testURL} from '@pageobject/standard-test';
import {Builder, WebDriver} from 'selenium-webdriver';
import {SeleniumPage} from '.';

async function createDriver(): Promise<WebDriver> {
  return new Builder()
    .withCapabilities({
      browserName: 'chrome',
      chromeOptions: {args: ['headless', 'disable-gpu']}
    })
    .build();
}

let page: SeleniumPage;

beforeAll(async () => {
  page = await SeleniumPage.load(testURL, await createDriver());
});

afterAll(async () => {
  await page.driver.quit();
});

describePageTests(() => page);
