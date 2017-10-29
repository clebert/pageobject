# PageObjectJS

[![Build Status][badge-travis-image]][badge-travis-link]
![Stability][badge-stability-image]

**Readable. Stable. Maintainable.** E2E testing using any browser automation framework.

## Documentation

Learn more about using PageObjectJS at [pageobject.js.org][docs]

- [Quick Start][docs-quick-start]
- [API References][docs-api-references]
- [Examples][docs-examples]
- [Guides][docs-guides]

## Packages

This is a multi-package repository ([monorepo][monorepo]).

### [@pageobject/class][docs-api-references-class]

A class-based implementation of the [Page Object Pattern][docs-guides-page-object-pattern] for JavaScript.

### [@pageobject/selenium-adapter][docs-api-references-selenium-adapter]

An adapter for connecting page objects to [Selenium][selenium].

## Development

### Installing dependencies and bootstrapping packages

```sh
npm install
```

### Upgrading dependencies

```sh
npm run upgrade
```

### Compiling sources and running unit tests continuously

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
Built by (c) Clemens Akens. Released under the terms of the [MIT License][license].

[badge-stability-image]: https://img.shields.io/badge/stability-unstable-yellow.svg
[badge-travis-image]: https://travis-ci.org/clebert/pageobject.svg?branch=master
[badge-travis-link]: https://travis-ci.org/clebert/pageobject

[docs]: https://clebert.github.io/pageobject/
[docs-api-references]: https://clebert.github.io/pageobject/api-references/
[docs-api-references-class]: https://clebert.github.io/pageobject/api-references/class.html
[docs-api-references-selenium-adapter]: https://clebert.github.io/pageobject/api-references/selenium-adapter.html
[docs-examples]: https://clebert.github.io/pageobject/examples/
[docs-guides]: https://clebert.github.io/pageobject/guides/
[docs-guides-page-object-pattern]: https://clebert.github.io/pageobject/guides/page-object-pattern.html
[docs-quick-start]: https://clebert.github.io/pageobject/#quick-start

[license]: https://github.com/clebert/pageobject/blob/master/LICENSE

[githooks]: https://git-scm.com/docs/githooks
[monorepo]: https://github.com/lerna/lerna#about
[selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
