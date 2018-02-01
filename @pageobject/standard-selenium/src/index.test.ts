import 'chromedriver'; /* tslint:disable-line no-import-side-effect */

import {StandardFinder} from '@pageobject/standard';
import {describeTests, url} from '@pageobject/standard-test';
import find from 'find-process';
import {Builder, WebDriver} from 'selenium-webdriver';
import {Options} from 'selenium-webdriver/chrome';
import {createFinder} from '.';

async function createDriver(): Promise<WebDriver> {
  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new Options().detachDriver(false).headless())
    .build();
}

let driver: WebDriver;
let finder: StandardFinder;

beforeAll(async () => {
  driver = await createDriver();
  finder = createFinder(driver);

  await driver.navigate().to(url);
});

afterAll(async () => {
  await driver.quit();

  const pids = (await find('name', /chromedriver/))
    .filter(process => /chromedriver/.test(process.name))
    .map(process => parseInt(process.pid, 10));

  for (const pid of pids) {
    process.kill(pid);
  }
});

describeTests(() => finder);
