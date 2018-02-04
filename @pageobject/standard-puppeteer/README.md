# @pageobject/standard-puppeteer [![Package Version][badge-npm-image]][badge-npm-link] [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link]

This package implements the [PageObjectJS standard API][internal-readme-standard] for [Puppeteer][external-puppeteer].

## Installation

```sh
yarn add @pageobject/standard-puppeteer
```

### Peer dependencies

```sh
yarn add @pageobject/core \
         @pageobject/standard \
         puppeteer
```

### TypeScript types

```sh
yarn add --dev @types/puppeteer
```

## API

Please find the API documentation [here][internal-api-standard-puppeteer].

## Usage

In this example we load the website [`example.com`][external-example-website] and test if the actual page title corresponds to the expected page title.

The **complete code** of this example can be found in the file [`example.js`][internal-example-standard-puppeteer].

### Create a new Puppeteer Browser instance

```js
const browser = await launch();
```

### Load the website

```js
const page = await PuppeteerPage.load('http://example.com/', browser);
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

### Run the tests using the page object

```js
assert.strictEqual(await root.getPageTitle(), 'Example Domain');
```

---

Built by (c) Clemens Akens. Released under the terms of the [MIT License][internal-license].

[badge-coveralls-image]: https://coveralls.io/repos/github/clebert/pageobject/badge.svg?branch=master
[badge-coveralls-link]: https://coveralls.io/github/clebert/pageobject?branch=master
[badge-npm-image]: https://img.shields.io/npm/v/@pageobject/standard-puppeteer.svg
[badge-npm-link]: https://yarnpkg.com/en/package/@pageobject/standard-puppeteer
[badge-travis-image]: https://travis-ci.org/clebert/pageobject.svg?branch=master
[badge-travis-link]: https://travis-ci.org/clebert/pageobject

[internal-api-standard-puppeteer]: https://pageobject.js.org/api/standard-puppeteer/
[internal-example-standard-puppeteer]: https://github.com/clebert/pageobject/blob/master/%40pageobject/standard-puppeteer/example.js
[internal-license]: https://github.com/clebert/pageobject/blob/master/LICENSE
[internal-readme-standard]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard/README.md

[external-example-website]: http://example.com/
[external-puppeteer]: https://github.com/GoogleChrome/puppeteer/blob/master/README.md
