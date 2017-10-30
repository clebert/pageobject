/* tslint:disable-next-line no-implicit-dependencies no-import-side-effect */
import 'chromedriver';

test('foo', async () => {
  throw new Error('an error');
});

afterEach('take screenshot on failure', async function(): Promise<void> {
  /* tslint:disable-next-line no-invalid-this */
  if (this.currentTest.state !== 'passed') {
    console.log('screenshot on fail');
  }
});

/*
import {SeleniumBrowser} from '@pageobject/selenium-adapter';
import {FrontPage} from '../pages/FrontPage';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

let browser: SeleniumBrowser;

beforeEach(async () => {
  browser = await SeleniumBrowser.launchHeadlessChrome();

  await browser.setElementSearchTimeout(5000);
  await browser.setPageLoadTimeout(10000);
});

afterEach(async () => {
  await browser.quit();
});

describe('GIVEN the Hacker News front page is open', () => {
  let frontPage: FrontPage;

  beforeEach(async () => {
    frontPage = await browser.open(
      FrontPage,
      'https://news.ycombinator.com/news'
    );
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
*/
