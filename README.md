# PageObjectJS [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link] [![TypeScript][badge-typescript-image]][badge-typescript-link]

Readable. Stable. Maintainable. E2E testing using any browser automation framework.

## Packages

This is a multi-package repository ([monorepo][monorepo]).

### @pageobject/core

**[README][repo-readme-core] | [API][repo-api-core]**

This package is the basis for the PageObjectJS standard API.

### @pageobject/engine

**[README][repo-readme-engine] | [API][repo-api-engine]**

This package makes it possible to execute arbitrary commands reliably.

### @pageobject/standard

**[README][repo-readme-standard] | [API][repo-api-standard]**

This package defines a standard API which can be implemented for any browser automation framework.

### @pageobject/standard-puppeteer

**[README][repo-readme-standard-puppeteer] | [API][repo-api-standard-puppeteer]**

This package implements the PageObjectJS standard API for [Puppeteer][puppeteer].

### @pageobject/standard-selenium

**[README][repo-readme-standard-selenium] | [API][repo-api-standard-selenium]**

This package implements the PageObjectJS standard API for [Selenium][selenium].

### @pageobject/standard-test

**[README][repo-readme-standard-test] | [API][repo-api-standard-test]**

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

By default, a [Git Hook][githooks] is installed to automatically format all files of a commit.
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

Built by (c) Clemens Akens. Released under the terms of the [MIT License][repo-license].

[badge-coveralls-image]: https://coveralls.io/repos/github/clebert/pageobject/badge.svg?branch=master
[badge-coveralls-link]: https://coveralls.io/github/clebert/pageobject?branch=master
[badge-travis-image]: https://travis-ci.org/clebert/pageobject.svg?branch=master
[badge-travis-link]: https://travis-ci.org/clebert/pageobject
[badge-typescript-image]: https://img.shields.io/badge/TypeScript-ready-blue.svg
[badge-typescript-link]: https://www.typescriptlang.org/
[repo-api-core]: https://pageobject.js.org/api/core/
[repo-api-engine]: https://pageobject.js.org/api/engine/
[repo-api-standard]: https://pageobject.js.org/api/standard/
[repo-api-standard-puppeteer]: https://pageobject.js.org/api/standard-puppeteer/
[repo-api-standard-selenium]: https://pageobject.js.org/api/standard-selenium/
[repo-api-standard-test]: https://pageobject.js.org/api/standard-test/
[repo-license]: https://github.com/clebert/pageobject/blob/master/LICENSE
[repo-readme-core]: https://github.com/clebert/pageobject/tree/master/@pageobject/core/README.md
[repo-readme-engine]: https://github.com/clebert/pageobject/tree/master/@pageobject/engine/README.md
[repo-readme-standard]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard/README.md
[repo-readme-standard-puppeteer]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard-puppeteer/README.md
[repo-readme-standard-selenium]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard-selenium/README.md
[repo-readme-standard-test]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard-test/README.md
[githooks]: https://git-scm.com/docs/githooks
[monorepo]: https://github.com/lerna/lerna#about
[puppeteer]: https://github.com/GoogleChrome/puppeteer/blob/master/README.md
[selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
