# PageObjectJS [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link] [![TypeScript][badge-typescript-image]][badge-typescript-link]

> **Readable**, **stable**, and **maintainable** E2E tests written using a browser automation framework of your choice.

⚠️ **This software is currently in beta stage. Breaking changes can happen at any time.**

## Getting started

For a quick start, please have a look at either the [Puppeteer example][internal-usage-standard-puppeteer] or the [Selenium example][internal-usage-standard-selenium].

For a more detailed example, please see **here** (coming soon).

## Packages

This is a multi-package repository ([monorepo][external-monorepo]).

### @pageobject/core

**[Installation][internal-installation-core] | [API][internal-api-core] | [Usage][internal-usage-core]**

This package is the basis for the PageObjectJS standard API.

### @pageobject/engine

**[Installation][internal-installation-engine] | [API][internal-api-engine] | [Usage][internal-usage-engine]**

This package allows you to execute unreliable, asynchronous, and [idempotent][external-wiki-idempotence] commands reliably.

### @pageobject/predicates

**[Installation][internal-installation-predicates] | [API][internal-api-predicates] | [Usage][internal-usage-predicates]**

This package provides a collection of useful predicate functions.

### @pageobject/standard

**[Installation][internal-installation-standard] | [API][internal-api-standard] | [Usage][internal-usage-standard]**

This package defines an API that can be implemented for virtually any browser automation framework.

### @pageobject/standard-puppeteer

**[Installation][internal-installation-standard-puppeteer] | [API][internal-api-standard-puppeteer] | [Usage][internal-usage-standard-puppeteer]**

This package implements the PageObjectJS standard API for [Puppeteer][external-puppeteer].

### @pageobject/standard-selenium

**[Installation][internal-installation-standard-selenium] | [API][internal-api-standard-selenium] | [Usage][internal-usage-standard-selenium]**

This package implements the PageObjectJS standard API for [Selenium][external-selenium].

### @pageobject/standard-test

**[Installation][internal-installation-standard-test] | [API][internal-api-standard-test] | [Usage][internal-usage-standard-test]**

This package allows you to test the compatibility of your implementation of the PageObjectJS standard API.

## Development

### Installing dependencies and bootstrapping packages

```sh
yarn install
```

### Compiling sources and running tests continuously

```sh
yarn run watch
```

### Running CI tests

```sh
yarn test
```

### Formatting sources

By default, a [Git Hook][external-githooks] is installed to automatically format all files of a commit.
Manually, it can be executed with the following command:

```sh
yarn run format
```

### Committing a change

```sh
yarn run commit
```

### Releasing a new version

```sh
yarn run release
```

---

Built by (c) Clemens Akens. Released under the terms of the [MIT License][internal-license].

[badge-coveralls-image]: https://coveralls.io/repos/github/clebert/pageobject/badge.svg?branch=master
[badge-coveralls-link]: https://coveralls.io/github/clebert/pageobject?branch=master
[badge-travis-image]: https://travis-ci.org/clebert/pageobject.svg?branch=master
[badge-travis-link]: https://travis-ci.org/clebert/pageobject
[badge-typescript-image]: https://img.shields.io/badge/TypeScript-ready-blue.svg
[badge-typescript-link]: https://www.typescriptlang.org/

[internal-api-core]: https://pageobject.js.org/api/core/
[internal-api-engine]: https://pageobject.js.org/api/engine/
[internal-api-predicates]: https://pageobject.js.org/api/predicates/
[internal-api-standard]: https://pageobject.js.org/api/standard/
[internal-api-standard-puppeteer]: https://pageobject.js.org/api/standard-puppeteer/
[internal-api-standard-selenium]: https://pageobject.js.org/api/standard-selenium/
[internal-api-standard-test]: https://pageobject.js.org/api/standard-test/
[internal-installation-core]: https://github.com/clebert/pageobject/tree/master/@pageobject/core/README.md#installation
[internal-installation-engine]: https://github.com/clebert/pageobject/tree/master/@pageobject/engine/README.md#installation
[internal-installation-predicates]: https://github.com/clebert/pageobject/tree/master/@pageobject/predicates/README.md#installation
[internal-installation-standard]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard/README.md#installation
[internal-installation-standard-puppeteer]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard-puppeteer/README.md#installation
[internal-installation-standard-selenium]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard-selenium/README.md#installation
[internal-installation-standard-test]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard-test/README.md#installation
[internal-license]: https://github.com/clebert/pageobject/blob/master/LICENSE
[internal-usage-core]: https://github.com/clebert/pageobject/blob/master/@pageobject/core/README.md#usage
[internal-usage-engine]: https://github.com/clebert/pageobject/blob/master/@pageobject/engine/README.md#usage
[internal-usage-predicates]: https://github.com/clebert/pageobject/blob/master/@pageobject/predicates/README.md#usage
[internal-usage-standard]: https://github.com/clebert/pageobject/blob/master/@pageobject/standard/README.md#usage
[internal-usage-standard-puppeteer]: https://github.com/clebert/pageobject/blob/master/@pageobject/standard-puppeteer/README.md#usage
[internal-usage-standard-selenium]: https://github.com/clebert/pageobject/blob/master/@pageobject/standard-selenium/README.md#usage
[internal-usage-standard-test]: https://github.com/clebert/pageobject/blob/master/@pageobject/standard-test/README.md#usage

[external-githooks]: https://git-scm.com/docs/githooks
[external-monorepo]: https://github.com/lerna/lerna#about
[external-puppeteer]: https://github.com/GoogleChrome/puppeteer/blob/master/README.md
[external-selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
[external-wiki-idempotence]: https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning
