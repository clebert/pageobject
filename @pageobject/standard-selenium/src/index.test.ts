import 'chromedriver'; /* tslint:disable-line no-import-side-effect */

import {describePageTests, url} from '@pageobject/standard-test';
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
  page = await SeleniumPage.load(url, await createDriver());
});

afterAll(async () => {
  await page.driver.quit();
});

describePageTests(() => page);
