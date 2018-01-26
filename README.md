# PageObjectJS [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link] [![TypeScript][badge-typescript-image]][badge-typescript-link]

**⚠️ Currently the API is under active development and therefore very unstable.**

The documentation follows as soon as the API can be kept stable.

## Packages

This is a multi-package repository ([monorepo][monorepo]).

### [@pageobject/core][repo-package-core]

TODO.

### [@pageobject/engine][repo-package-engine]

TODO.

### [@pageobject/standard][repo-package-standard]

TODO.

### [@pageobject/standard-selenium][repo-package-standard-selenium]

TODO.

### [@pageobject/standard-test][repo-package-standard-test]

TODO.

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
[repo-package-core]: https://github.com/clebert/pageobject/tree/master/@pageobject/core
[repo-package-engine]: https://github.com/clebert/pageobject/tree/master/@pageobject/engine
[repo-package-standard]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard
[repo-package-standard-selenium]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard-selenium
[repo-package-standard-test]: https://github.com/clebert/pageobject/tree/master/@pageobject/standard-test
[githooks]: https://git-scm.com/docs/githooks
[monorepo]: https://github.com/lerna/lerna#about
