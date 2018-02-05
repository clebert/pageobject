# @pageobject/standard [![Package Version][badge-npm-image]][badge-npm-link] [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link]

> This package defines an API that can be implemented for virtually any browser automation framework.

## Installation

```sh
yarn add @pageobject/standard
```

## API

Please find the API documentation [here][internal-api-standard].

## Usage

> For examples of use, please have a look at either the [Puppeteer example][internal-usage-standard-puppeteer] or the [Selenium example][internal-usage-standard-selenium]. For a more detailed example, please see **here** (coming soon).

The PageObjectJS standard API defines the interface `StandardElement` as the representation of a DOM element and the interface `StandardPage` as the representation of the DOM. The abstract class `StandardPageObject` offers methods to comfortably use these representations.

Page objects inheriting from class `StandardPageObject` are compatible with any browser automation framework for which the PageObjectJS standard API can be implemented.

**Compatible implementations already exist for [Puppeteer][external-puppeteer] and [Selenium][external-selenium]!**

If you want to write your own implementation of the PageObjectJS standard API for a browser automation framework of your choice, you have to implement the interfaces `StandardElement` and `StandardPage`. The package [@pageobject/standard-test][internal-usage-standard-test] can help you to test your implementation for compatibility.

---

Built by (c) Clemens Akens. Released under the terms of the [MIT License][internal-license].

[badge-coveralls-image]: https://coveralls.io/repos/github/clebert/pageobject/badge.svg?branch=master
[badge-coveralls-link]: https://coveralls.io/github/clebert/pageobject?branch=master
[badge-npm-image]: https://img.shields.io/npm/v/@pageobject/standard.svg
[badge-npm-link]: https://yarnpkg.com/en/package/@pageobject/standard
[badge-travis-image]: https://travis-ci.org/clebert/pageobject.svg?branch=master
[badge-travis-link]: https://travis-ci.org/clebert/pageobject

[internal-api-standard]: https://pageobject.js.org/api/standard/
[internal-license]: https://github.com/clebert/pageobject/blob/master/LICENSE
[internal-usage-standard-puppeteer]: https://github.com/clebert/pageobject/blob/master/@pageobject/standard-puppeteer/README.md#usage
[internal-usage-standard-selenium]: https://github.com/clebert/pageobject/blob/master/@pageobject/standard-selenium/README.md#usage
[internal-usage-standard-test]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard-test/README.md#usage

[external-puppeteer]: https://github.com/GoogleChrome/puppeteer/blob/master/README.md
[external-selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
