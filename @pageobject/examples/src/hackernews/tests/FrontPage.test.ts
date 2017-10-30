/* tslint:disable-next-line no-implicit-dependencies no-import-side-effect */
import 'chromedriver';

import {SeleniumBrowser} from '@pageobject/selenium-adapter';
import * as assert from 'assert';
import {FrontPage} from '../pages/FrontPage';

let browser: SeleniumBrowser;

setup(async () => {
  browser = await SeleniumBrowser.launchHeadlessChrome();

  await browser.setElementSearchTimeout(5000);
  await browser.setPageLoadTimeout(10000);
});

teardown(async function callback(): Promise<void> {
  try {
    /* tslint:disable-next-line no-invalid-this */
    if (this.currentTest.state !== 'passed') {
      const screenshot = await browser.adapter.driver.takeScreenshot();

      allure.createAttachment('screenshot on fail', screenshot);
    }
  } finally {
    await browser.quit();
  }
});

suite('GIVEN the Hacker News front page is open', () => {
  let frontPage: FrontPage;

  setup(async () => {
    frontPage = await browser.open(
      FrontPage,
      'https://news.ycombinator.com/news'
    );
  });

  test('THEN the displayed rank of a news should match its position in the news list', async () => {
    const newsList = frontPage.selectNewsList();
    const news3 = newsList.selectNews(3);

    assert.strictEqual(await news3.item.getRank(), 3);
  });

  suite('WHEN the user is not logged in', () => {
    test('THEN hiding a news should trigger a redirect to the login page', async () => {
      const newsList = frontPage.selectNewsList();
      const news = newsList.selectNews();

      const loginPage = await news.subtext.hideAsAnonymous();

      assert.ok(
        await loginPage.displaysMessage('You have to be logged in to hide.')
      );
    });

    test('THEN voting a news should trigger a redirect to the login page', async () => {
      const newsList = frontPage.selectNewsList();
      const news = newsList.selectNews();

      const loginPage = await news.item.voteAsAnonymous();

      assert.ok(
        await loginPage.displaysMessage('You have to be logged in to vote.')
      );
    });
  });
});
