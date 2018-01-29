# PageObjectJS [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link] [![TypeScript][badge-typescript-image]][badge-typescript-link]

Readable. Stable. Maintainable. E2E testing using any browser automation framework.

## Packages

This is a multi-package repository ([monorepo][monorepo]).

### [@pageobject/core][repo-readme-core]

This package is the basis for the PageObjectJS standard API.

### [@pageobject/engine][repo-readme-engine]

This package makes it possible to execute arbitrary commands reliably.

### [@pageobject/standard][repo-readme-standard]

This package defines a standard API which can be implemented for any browser automation framework.

### [@pageobject/standard-selenium][repo-readme-standard-selenium]

This package implements the PageObjectJS standard API for [Selenium][selenium].

### [@pageobject/standard-test][repo-readme-standard-test]

This package allows you to test the compatibility of your implementation of the PageObjectJS standard API.

## Development

### Installing dependencies and bootstrapping packages

```sh
yarn install
```

### Upgrading dependencies

```sh
yarn run upgrade
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
[repo-license]: https://github.com/clebert/pageobject/blob/master/LICENSE
[repo-readme-core]: https://github.com/clebert/pageobject/tree/master/@pageobject/core
[repo-readme-engine]: https://github.com/clebert/pageobject/tree/master/@pageobject/engine
[repo-readme-standard]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard
[repo-readme-standard-selenium]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard-selenium
[repo-readme-standard-test]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard-test
[githooks]: https://git-scm.com/docs/githooks
[monorepo]: https://github.com/lerna/lerna#about
[selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
