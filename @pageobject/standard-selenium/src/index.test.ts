import 'chromedriver'; /* tslint:disable-line no-import-side-effect */

import {describePageTests, url} from '@pageobject/standard-test';
import find from 'find-process';
import {Builder, WebDriver} from 'selenium-webdriver';
import {Options} from 'selenium-webdriver/chrome';
import {SeleniumPage} from '.';

async function createDriver(): Promise<WebDriver> {
  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new Options().detachDriver(false).headless())
    .build();
}

async function killDriver(): Promise<void> {
  const pids = (await find('name', /chromedriver/))
    .filter(chromeProcess => /chromedriver/.test(chromeProcess.name))
    .map(chromeProcess => parseInt(chromeProcess.pid, 10));

  for (const pid of pids) {
    process.kill(pid);
  }
}

let page: SeleniumPage;

beforeAll(async () => {
  page = await SeleniumPage.load(url, await createDriver());
});

afterAll(async () => {
  await page.driver.quit();

  await killDriver();
});

describePageTests(() => page);
