# Example: A test suite for [Hacker News][hackernews]

This example uses [Jest][jest] as test runner and [Puppeteer][puppeteer] as browser automation library.

It is written in [TypeScript][typescript], **the entire code can be found [here][repo-example-code-hackernews-puppeteer].**

## Overview

- [Tests](#tests)
- [Page Objects](#page-objects)
  - [Page `FrontPage`](#page-frontpage)
  - [Component `NewsList`](#component-newslist)
  - [Component `NewsItem`](#component-newsitem)
  - [Component `NewsSubtext`](#component-newssubtext)
  - [Page `LoginPage`](#page-loginpage)
  - [Page `HideLoginPage`](#page-hideloginpage)
  - [Page `VoteLoginPage`](#page-voteloginpage)

## Tests

```sh
PASS @pageobject/examples/src/hackernews/puppeteer/tests/FrontPage.test.ts
  GIVEN the Hacker News front page is open
    ✓ THEN the displayed rank of a news should match its position in the news list
    WHEN the user is not logged in
      ✓ THEN hiding a news should trigger a redirect to the login page
      ✓ THEN voting a news should trigger a redirect to the login page

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

```js
let adapter: PuppeteerAdapter;

beforeEach(async () => {
  adapter = await PuppeteerAdapter.launchChrome();
});

afterEach(async () => {
  await adapter.browser.close();
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
```

## Page Objects

### Page `FrontPage`

![pages/FrontPage](pages/FrontPage.png)

```js
class FrontPage extends PageObject<ElementHandle, PuppeteerAdapter> {
  public static selectors = [NewsList.selector];
  public static url = /\/news$/;

  public static async open(adapter: PuppeteerAdapter): Promise<FrontPage> {
    return adapter.open(FrontPage, 'https://news.ycombinator.com/news');
  }

  public selectNewsList(): NewsList {
    return this.selectUniqueDescendant(NewsList);
  }
}
```

### Component `NewsList`

![components/NewsList](components/NewsList.png)

```js
interface News {
  readonly item: NewsItem;
  readonly subtext: NewsSubtext;
}

class NewsList extends PageObject<ElementHandle, PuppeteerAdapter> {
  public static selector = 'table.itemlist';

  public selectNews(n: number = 1): News {
    return {
      item: this.selectUniqueDescendant(NewsItem, atIndex(n - 1)),
      subtext: this.selectUniqueDescendant(NewsSubtext, atIndex(n - 1))
    };
  }
}
```

### Component `NewsItem`

![components/NewsItem](components/NewsItem.png)

```js
class NewsItem extends PageObject<ElementHandle, PuppeteerAdapter> {
  public static selector = 'tr.athing';
```

#### Descendant Element `span.rank`

![components/NewsItem/span.rank](components/NewsItem/span.rank.png)

```js
  public async getRank(): Promise<number> {
    const innerTextHandle = await this.adapter.page.evaluateHandle(
      element => element.innerText.trim(),
      await this.findUniqueDescendant('span.rank')
    );

    try {
      return parseInt(await innerTextHandle.jsonValue(), 10);
    } finally {
      await innerTextHandle.dispose();
    }
  }
```

#### Descendant Element `div.votearrow`

![components/NewsItem/div.votearrow](components/NewsItem/div.votearrow.png)

```js
  public async vote(): Promise<void> {
    const element = await this.findUniqueDescendant('div.votearrow');

    await element.click();
  }

  public async voteAsAnonymous(): Promise<VoteLoginPage> {
    await this.vote();

    return this.goto(VoteLoginPage);
  }
}
```

### Component `NewsSubtext`

![components/NewsSubtext](components/NewsSubtext.png)

```js
class NewsSubtext extends PageObject<ElementHandle, PuppeteerAdapter> {
  public static selector = 'td.subtext';
```

#### Descendant Element `a` + `textEquals('hide')`

![components/NewsSubtext/a-hide](components/NewsSubtext/a-hide.png)

```js
  public async hide(): Promise<void> {
    const element = await this.findUniqueDescendant('a', textEquals('hide'));

    await element.click();
  }

  public async hideAsAnonymous(): Promise<HideLoginPage> {
    await this.hide();

    return this.goto(HideLoginPage);
  }
}
```

### Page `LoginPage`

![pages/LoginPage](pages/LoginPage.png)

```js
const selectors = [
  'input[type="submit"][value="login"]',
  'input[type="submit"][value="create account"]'
];
```

```js
class LoginPage extends PageObject<ElementHandle, PuppeteerAdapter> {
  public static selectors = selectors;
  public static url = /login/;

  public async displaysMessage(message: string): Promise<boolean> {
    const innerTextHandle = await this.adapter.page.evaluateHandle(
      element => element.innerText.trim(),
      await this.findSelf()
    );

    try {
      return (await innerTextHandle.jsonValue()).indexOf(message) > -1;
    } finally {
      await innerTextHandle.dispose();
    }
  }
}
```

### Page `HideLoginPage`

![pages/HideLoginPage](pages/HideLoginPage.png)

```js
class HideLoginPage extends LoginPage {
  public static selectors = selectors;
  public static url = /hide\?id=[0-9]+/;
}
```

### Page `VoteLoginPage`

![pages/VoteLoginPage](pages/VoteLoginPage.png)

```js
class VoteLoginPage extends LoginPage {
  public static selectors = selectors;
  public static url = /vote\?id=[0-9]+/;
}
```

[repo-example-code-hackernews-puppeteer]: https://github.com/clebert/pageobject/tree/master/@pageobject/examples/src/hackernews/puppeteer

[hackernews]: https://news.ycombinator.com/news
[jest]: http://facebook.github.io/jest/
[puppeteer]: https://github.com/GoogleChrome/puppeteer
[typescript]: https://www.typescriptlang.org/