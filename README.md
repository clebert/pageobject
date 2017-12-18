# PageObjectJS [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link] [![TypeScript][badge-typescript-image]][badge-typescript-link]

**⚠️ Currently the API is under active development and therefore very unstable.**

The documentation follows as soon as the API can be kept stable.

## Packages

This is a multi-package repository ([monorepo][monorepo]).

### [@pageobject/class][repo-package-class]

A class-based implementation of the Page Object pattern for JavaScript.

### [@pageobject/predicates][repo-package-predicates]

A collection of useful predicate functions.

### [@pageobject/selenium-adapter][repo-package-selenium-adapter]

An adapter for connecting page objects to [Selenium][selenium].

### [@pageobject/puppeteer-adapter][repo-package-puppeteer-adapter]

An adapter for connecting page objects to [Puppeteer][puppeteer].

## Development

### Installing dependencies and bootstrapping packages

```sh
npm install
```

### Upgrading dependencies

```sh
npm run upgrade
```

### Compiling sources and running tests continuously

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
[badge-travis-image]: https://travis-ci.org/clebert/pageobject.svg?branch=master
[badge-travis-link]: https://travis-ci.org/clebert/pageobject
[badge-typescript-image]: https://img.shields.io/badge/TypeScript-ready-blue.svg
[badge-typescript-link]: https://www.typescriptlang.org/
[repo-license]: https://github.com/clebert/pageobject/blob/master/LICENSE
[repo-package-class]: https://github.com/clebert/pageobject/tree/master/@pageobject/class
[repo-package-predicates]: https://github.com/clebert/pageobject/tree/master/@pageobject/predicates
[repo-package-puppeteer-adapter]: https://github.com/clebert/pageobject/tree/master/@pageobject/puppeteer-adapter
[repo-package-selenium-adapter]: https://github.com/clebert/pageobject/tree/master/@pageobject/selenium-adapter
[githooks]: https://git-scm.com/docs/githooks
[monorepo]: https://github.com/lerna/lerna#about
[puppeteer]: https://github.com/GoogleChrome/puppeteer
[selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
