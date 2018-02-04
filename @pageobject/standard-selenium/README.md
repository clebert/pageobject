# @pageobject/standard-selenium [![Package Version][badge-npm-image]][badge-npm-link] [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link]

This package implements the [PageObjectJS standard API][internal-readme-standard] for [Selenium][external-selenium].

## Installation

```sh
yarn add @pageobject/standard-selenium
```

### Peer dependencies

```sh
yarn add @pageobject/core \
         @pageobject/standard \
         selenium-webdriver
```

### TypeScript types

```sh
yarn add --dev @types/selenium-webdriver
```

## API

Please find the API documentation [here][internal-api-standard-selenium].

## Usage

In this example we load the website [`example.com`][external-example-website] and test if the actual page title corresponds to the expected page title.

The **complete code** of this example can be found in the file [`example.js`][internal-example-standard-selenium].

### Create a new Selenium WebDriver instance

```js
const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new Options().detachDriver(false).headless())
  .build();
```

Please make sure you have the latest version of Chrome installed.

Additionally a suitable ChromeDriver is required, in this example we use [`node-chromedriver`][external-node-chromedriver] to install it.

```js
require('chromedriver');
```

### Load the website

```js
const page = await SeleniumPage.load('http://example.com/', driver);
```

### Create a page object

```js
class Root extends StandardPageObject {
  get selector() {
    return ':root';
  }
}

const root = new Root(page);
```

### Run the assertion using the page object

```js
assert.strictEqual(await root.getPageTitle(), 'Example Domain');
```

---

Built by (c) Clemens Akens. Released under the terms of the [MIT License][internal-license].

[badge-coveralls-image]: https://coveralls.io/repos/github/clebert/pageobject/badge.svg?branch=master
[badge-coveralls-link]: https://coveralls.io/github/clebert/pageobject?branch=master
[badge-npm-image]: https://img.shields.io/npm/v/@pageobject/standard-selenium.svg
[badge-npm-link]: https://yarnpkg.com/en/package/@pageobject/standard-selenium
[badge-travis-image]: https://travis-ci.org/clebert/pageobject.svg?branch=master
[badge-travis-link]: https://travis-ci.org/clebert/pageobject

[internal-api-standard-selenium]: https://pageobject.js.org/api/standard-selenium/
[internal-example-standard-selenium]: https://github.com/clebert/pageobject/blob/master/@pageobject/standard-selenium/example.js
[internal-license]: https://github.com/clebert/pageobject/blob/master/LICENSE
[internal-readme-standard]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard/README.md

[external-example-website]: http://example.com/
[external-node-chromedriver]: https://github.com/giggio/node-chromedriver
[external-selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
