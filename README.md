# PageObjectJS [![Build Status][badge-travis-image]][badge-travis-link] [![Coverage Status][badge-coveralls-image]][badge-coveralls-link] [![TypeScript][badge-typescript-image]][badge-typescript-link]

> **Reliable**, **stable**, and **flexible** web UI testing.

## Getting Started

**Example:** Navigate to `example.com` and assert that the page title equals `Example Domain`.

```js
class Page extends FlexiblePageObject {
  get selector() {
    return ':root'; // https://developer.mozilla.org/en-US/docs/Web/CSS/:root
  }
}

function describe(testCase, page) {
  testCase
    .perform(page.navigateTo('http://example.com/'))
    .assert(page.getPageTitle(equals('Example Domain')));
}
```

You can find the complete code of the example [here][internal-example-getting-started].
It can be executed with Node.js 8 or higher.

## Packages

This is a multi-package repository ([monorepo][external-monorepo]).

### @pageobject/reliable

**[Installation][internal-installation-reliable] | [API][internal-api-reliable]**

Write **reliable** tests in a declarative programming style.

### @pageobject/stable

**[Installation][internal-installation-stable] | [API][internal-api-stable]**

Write **stable** tests using a sophisticated implementation of the [page object pattern][external-pageobject].

### @pageobject/flexible

**[Installation][internal-installation-flexible] | [API][internal-api-flexible]**

Write **flexible** tests using a @pageobject/stable-based API which is adaptable for different browser automation frameworks.

### @pageobject/flexible-puppeteer

**[Installation][internal-installation-flexible-puppeteer] | [API][internal-api-flexible-puppeteer]**

Run your @pageobject/flexible-based tests using [Puppeteer][external-puppeteer].

### @pageobject/flexible-selenium

**[Installation][internal-installation-flexible-selenium] | [API][internal-api-flexible-selenium]**

Run your @pageobject/flexible-based tests using [Selenium][external-selenium].

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

[internal-example-getting-started]: https://github.com/clebert/pageobject/blob/master/docs/examples/getting-started.js

[internal-installation-flexible]: https://github.com/clebert/pageobject/tree/master/@pageobject/flexible/README.md#installation
[internal-installation-flexible-puppeteer]: https://github.com/clebert/pageobject/tree/master/@pageobject/flexible-puppeteer/README.md#installation
[internal-installation-flexible-selenium]: https://github.com/clebert/pageobject/tree/master/@pageobject/flexible-selenium/README.md#installation
[internal-installation-reliable]: https://github.com/clebert/pageobject/tree/master/@pageobject/reliable/README.md#installation
[internal-installation-stable]: https://github.com/clebert/pageobject/tree/master/@pageobject/stable/README.md#installation

[internal-license]: https://github.com/clebert/pageobject/blob/master/LICENSE

[external-monorepo]: https://github.com/lerna/lerna#about
[external-pageobject]: https://martinfowler.com/bliki/PageObject.html
[external-puppeteer]: https://github.com/GoogleChrome/puppeteer/blob/master/README.md
[external-selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
