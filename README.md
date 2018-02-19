# PageObjectJS [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link] [![TypeScript][badge-typescript-image]][badge-typescript-link]

> **Reliable**, **stable**, but **flexible** web UI testing.

⚠️ **This software is currently in beta stage. Breaking changes can happen at any time.**

## Packages

This is a multi-package repository ([monorepo][external-monorepo]).

### @pageobject/reliable

**[Installation][internal-installation-reliable] | [API][internal-api-reliable]**

TODO.

### @pageobject/stable

**[Installation][internal-installation-stable] | [API][internal-api-stable]**

TODO.

### @pageobject/flexible

**[Installation][internal-installation-flexible] | [API][internal-api-flexible]**

TODO.

### @pageobject/flexible-puppeteer

**[Installation][internal-installation-flexible-puppeteer] | [API][internal-api-flexible-puppeteer]**

TODO.

### @pageobject/flexible-selenium

**[Installation][internal-installation-flexible-selenium] | [API][internal-api-flexible-selenium]**

TODO.

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

[internal-api-flexible]: https://pageobject.js.org/api/flexible/
[internal-api-flexible-puppeteer]: https://pageobject.js.org/api/flexible-puppeteer/
[internal-api-flexible-selenium]: https://pageobject.js.org/api/flexible-selenium/
[internal-api-reliable]: https://pageobject.js.org/api/reliable/
[internal-api-stable]: https://pageobject.js.org/api/stable/

[internal-installation-flexible]: https://github.com/clebert/pageobject/tree/master/@pageobject/flexible/README.md#installation
[internal-installation-flexible-puppeteer]: https://github.com/clebert/pageobject/tree/master/@pageobject/flexible-puppeteer/README.md#installation
[internal-installation-flexible-selenium]: https://github.com/clebert/pageobject/tree/master/@pageobject/flexible-selenium/README.md#installation
[internal-installation-reliable]: https://github.com/clebert/pageobject/tree/master/@pageobject/reliable/README.md#installation
[internal-installation-stable]: https://github.com/clebert/pageobject/tree/master/@pageobject/stable/README.md#installation

[internal-license]: https://github.com/clebert/pageobject/blob/master/LICENSE

[external-monorepo]: https://github.com/lerna/lerna#about
