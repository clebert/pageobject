# @pageobject/predicates [![Package Version][badge-npm-image]][badge-npm-link] [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link]

> This package provides a collection of useful predicate functions.

## Installation

```sh
yarn add @pageobject/predicates
```

## API

Please find the API documentation [here][internal-api-predicates].

## Usage

The result of a predicate function serves as an additional selection criterion for assigning a unique DOM element to a page object.

### Example

```js
pageObject.select(OtherPageObject).where(indexEquals(0));
```

---

Built by (c) Clemens Akens. Released under the terms of the [MIT License][internal-license].

[badge-coveralls-image]: https://coveralls.io/repos/github/clebert/pageobject/badge.svg?branch=master
[badge-coveralls-link]: https://coveralls.io/github/clebert/pageobject?branch=master
[badge-npm-image]: https://img.shields.io/npm/v/@pageobject/predicates.svg
[badge-npm-link]: https://yarnpkg.com/en/package/@pageobject/predicates
[badge-travis-image]: https://travis-ci.org/clebert/pageobject.svg?branch=master
[badge-travis-link]: https://travis-ci.org/clebert/pageobject

[internal-api-predicates]: https://pageobject.js.org/api/predicates/
[internal-license]: https://github.com/clebert/pageobject/blob/master/LICENSE
