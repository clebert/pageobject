import 'chromedriver'; /* tslint:disable-line no-import-side-effect */

import {describeTests, testURL} from '@pageobject/flexible';
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

beforeEach(async () => {
  await page.driver.navigate().refresh();
});

describeTests(() => page);
