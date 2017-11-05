# PageObjectJS [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link] ![Stability][badge-stability-image]

[**Getting Started**](#getting-started) | [**API References**](docs/api-references/index.md) | [**Examples**](docs/examples/index.md) | [**Guides**](docs/guides/index.md)

PageObjectJS is a class-based implementation of the [Page Object pattern](docs/guides/page-object-pattern.md) for JavaScript.
It allows you to write **readable**, **stable**, and **maintainable** automated E2E tests using a simple but powerful [API](docs/api-references/index.md).

Your tests can be written using any browser automation framework, all you need is an appropriate adapter.
An adapter connects a specific browser automation library with [@pageobject/class][repo-package-class].

The following adapters are currently available:

- [@pageobject/selenium-adapter][repo-package-selenium-adapter] → [Selenium][selenium]

**PageObjectJS is inspired by a Facebook talk at the SeleniumConf Berlin.**

[![Facebook Talk][facebook-talk-image]][facebook-talk-video]

## Overview

- [Getting Started](#getting-started)
  - [Using Selenium](#using-selenium)
- [Packages](#packages)
- [Development](#development)

## Getting Started

Please note that unlike the examples below it is recommended to use a test runner like [Jest][jest].

Then, before you start to write your own E2E tests, you should also become familiar with the [implementation notes](docs/guides/page-object-pattern.md#implementation-notes) and [full examples](docs/examples/index.md).

### Using Selenium

**Install dependencies:**

```sh
npm install \
  @pageobject/class \
  @pageobject/selenium-adapter \
  selenium-webdriver \
  chromedriver
```

Please ensure that Node.js `>=8` and Chrome `>=59` are also installed.

**Create a file `ExamplePage.js`:**

```js
const {PageObject} = require('@pageobject/class');

class ExamplePage extends PageObject {
  async getHeadline() {
    const element = await this.findUniqueDescendant('h1');

    return element.getText();
  }
}

ExamplePage.selectors = ['h1'];
ExamplePage.url = /example\.com/;

exports.ExamplePage = ExamplePage;
```

**Create a file `test.js`:**

```js
require('chromedriver');

const {SeleniumAdapter} = require('@pageobject/selenium-adapter');
const assert = require('assert');
const {ExamplePage} = require('./ExamplePage');

(async () => {
  const adapter = await SeleniumAdapter.launchHeadlessChrome();

  try {
    const page = await adapter.open(ExamplePage, 'https://example.com/');

    assert.strictEqual(await page.getHeadline(), 'Example Domain');

    console.log('OK');
  } finally {
    await adapter.driver.quit();
  }
})().catch(e => {
  console.error(e.message);

  process.exit(1);
});
```

**Run the test:**

```sh
node test.js
```

## Packages

This is a multi-package repository ([monorepo][monorepo]).

### [@pageobject/class][repo-package-class]

A class-based implementation of the [Page Object pattern](docs/guides/page-object-pattern.md) for JavaScript.

### [@pageobject/selenium-adapter][repo-package-selenium-adapter]

An adapter for connecting page objects to [Selenium][selenium].

## Development

### Installing dependencies and bootstrapping packages

```sh
npm install
```

### Upgrading dependencies

```sh
npm run upgrade
```

### Compiling sources and running unit tests continuously

```sh
npm run watch
```

### Running CI tests

```sh
npm test
```

### Formatting sources

By default, a [Git Hook][githooks] is installed to automatically format all files of a commit.
Manually, it can be executed with the following command:

```sh
npm run format
```

### Committing a change

```sh
npm run commit
```

### Releasing a new version

```sh
npm run release
```

---
Built by (c) Clemens Akens. Released under the terms of the [MIT License][repo-license].

[badge-coveralls-image]: https://coveralls.io/repos/github/clebert/pageobject/badge.svg?branch=master
[badge-coveralls-link]: https://coveralls.io/github/clebert/pageobject?branch=master
[badge-stability-image]: https://img.shields.io/badge/stability-unstable-yellow.svg
[badge-travis-image]: https://travis-ci.org/clebert/pageobject.svg?branch=master
[badge-travis-link]: https://travis-ci.org/clebert/pageobject

[repo-license]: https://github.com/clebert/pageobject/blob/master/LICENSE
[repo-package-class]: https://github.com/clebert/pageobject/tree/master/@pageobject/class
[repo-package-selenium-adapter]: https://github.com/clebert/pageobject/tree/master/@pageobject/selenium-adapter

[facebook-talk-image]: http://img.youtube.com/vi/diYgXpktTqo/0.jpg
[facebook-talk-video]: https://youtu.be/diYgXpktTqo
[githooks]: https://git-scm.com/docs/githooks
[jest]: http://facebook.github.io/jest/
[monorepo]: https://github.com/lerna/lerna#about
[selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
