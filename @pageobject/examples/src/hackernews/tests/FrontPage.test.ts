/* tslint:disable-next-line no-implicit-dependencies no-import-side-effect */
import 'chromedriver';

import {SeleniumAdapter} from '@pageobject/selenium-adapter';
import {FrontPage} from '../pages/FrontPage';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

let adapter: SeleniumAdapter;

beforeEach(async () => {
  adapter = await SeleniumAdapter.launchHeadlessChrome();
});

afterEach(async () => {
  await adapter.driver.quit();
});

describe('GIVEN the Hacker News front page is open', () => {
  let frontPage: FrontPage;

  beforeEach(async () => {
    frontPage = await FrontPage.open(adapter);
  });

  test('THEN the displayed rank of a news should match its position in the news list', async () => {
    const newsList = frontPage.selectNewsList();
    const news3 = newsList.selectNews(3);

    expect(await news3.item.getRank()).toBe(3);
  });

  describe('WHEN the user is not logged in', () => {
    test('THEN hiding a news should trigger a redirect to the login page', async () => {
      const newsList = frontPage.selectNewsList();
      const news = newsList.selectNews();

      const loginPage = await news.subtext.hideAsAnonymous();

      expect(
        await loginPage.displaysMessage('You have to be logged in to hide.')
      ).toBe(true);
    });

    test('THEN voting a news should trigger a redirect to the login page', async () => {
      const newsList = frontPage.selectNewsList();
      const news = newsList.selectNews();

      const loginPage = await news.item.voteAsAnonymous();

      expect(
        await loginPage.displaysMessage('You have to be logged in to vote.')
      ).toBe(true);
    });
  });
});
