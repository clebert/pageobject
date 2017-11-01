# PageObjectJS

> If you have WebDriver APIs in your test methods, You're Doing It Wrong.
>
> -- [Simon Stewart][simon-stewart]

PageObjectJS is a class-based implementation of the [Page Object pattern](guides/page-object-pattern.md) for JavaScript.
It allows you to write **readable**, **stable**, and **maintainable** automated E2E tests using a simple but powerful [API](api-references/index.md).

Your tests can be written using any browser automation framework, all you need is an appropriate adapter.
An adapter connects a specific browser automation library with [@pageobject/class](api-references/class.md).

The following adapters already exist:

- [@pageobject/selenium-adapter](api-references/selenium-adapter.md) → [Selenium][selenium]

are planned:

- @pageobject/adapter-protractor → [Protractor][protractor]
- @pageobject/adapter-puppeteer → [Puppeteer][puppeteer]

**This implementation is inspired by a Facebook talk at the SeleniumConf Berlin 2017:**

[![Facebook Talk][facebook-talk-image]][facebook-talk-video]

## Documentation

- [API References](api-references/index.md)
- [Examples](examples/index.md)
- [Guides](guides/index.md)

## Quick Start

**Please ensure that Node.js `>=8` and Chrome `>=59` are installed.**

Install dependencies:

```sh
npm install \
  @pageobject/class \
  @pageobject/selenium-adapter \
  selenium-webdriver \
  chromedriver
```

Create a `test.js` file:

```js
require('chromedriver');

const {PageObject} = require('@pageobject/class');
const {SeleniumBrowser} = require('@pageobject/selenium-adapter');
const assert = require('assert');

class ExamplePage extends PageObject {
  async getHeadline() {
    const element = await this.findUniqueDescendant('h1');

    return element.getText();
  }
}

ExamplePage.InitialElements = ['h1'];
ExamplePage.url = /example\.com/;

(async () => {
  const browser = await SeleniumBrowser.launchHeadlessChrome();

  await browser.setElementSearchTimeout(5000);

  try {
    const page = await browser.open(ExamplePage, 'https://example.com/');

    assert.strictEqual(await page.getHeadline(), 'Example Domain');

    console.log('OK');
  } finally {
    await browser.quit();
  }
})().catch(e => {
  console.error(e.message);

  process.exit(1);
});
```

Run the test:

```sh
node test.js
```

In contrast to the example above, it is recommended to use a test runner like [Jest][jest].

**Before you start to write your own E2E tests, you should also become familiar with the [implementation notes](guides/page-object-pattern.md#implementation-notes) and [examples](examples/index.md).**

[facebook-talk-image]: http://img.youtube.com/vi/diYgXpktTqo/0.jpg
[facebook-talk-video]: https://youtu.be/diYgXpktTqo
[jest]: http://facebook.github.io/jest/
[protractor]: http://www.protractortest.org/#/
[puppeteer]: https://github.com/GoogleChrome/puppeteer
[selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
[simon-stewart]: https://twitter.com/shs96c
