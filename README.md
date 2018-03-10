# PageObjectJS

[![Build Status][badge-travis-image]][badge-travis-link]
[![Coverage Status][badge-coveralls-image]][badge-coveralls-link]
[![TypeScript][badge-typescript-image]][badge-typescript-link]

> **Reliable**, **stable**, and **flexible** web UI testing.

## Getting started

In this example we navigate to [example.com][external-example-domain] and assert that the page title equals "Example Domain".

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

_You can find the complete code for this example [here][internal-example-code-getting-started]._
_It can be executed with Node.js 8 or higher._

## API documentation

### [@pageobject/reliable][internal-api-reliable]

Write **reliable** tests in a declarative programming style.

### [@pageobject/stable][internal-api-stable]

Write **stable** tests using a sophisticated implementation of the [page object pattern][external-pageobject].

### [@pageobject/flexible][internal-api-flexible]

Write **flexible** tests using a @pageobject/stable-based API which is adaptable for different browser automation frameworks.

### [@pageobject/flexible-protractor][internal-api-flexible-protractor]

Run your @pageobject/flexible-based tests using [Protractor][external-protractor].

### [@pageobject/flexible-puppeteer][internal-api-flexible-puppeteer]

Run your @pageobject/flexible-based tests using [Puppeteer][external-puppeteer].

### [@pageobject/flexible-selenium][internal-api-flexible-selenium]

Run your @pageobject/flexible-based tests using [Selenium][external-selenium].

## Tutorial: TodoMVC

In this tutorial we write a test case for the TodoMVC application.
We will create several page objects and learn about different design principles.

**You can find the step-by-step instructions [here][internal-example-docs-todo-mvc].**

[![todo-mvc][internal-example-image-todo-mvc]][internal-example-docs-todo-mvc]

---

Copyright (c) 2017-present, Clemens Akens. Released under the terms of the [MIT License][internal-license].

[badge-coveralls-image]: https://coveralls.io/repos/github/clebert/pageobject/badge.svg?branch=master
[badge-coveralls-link]: https://coveralls.io/github/clebert/pageobject?branch=master
[badge-travis-image]: https://travis-ci.org/clebert/pageobject.svg?branch=master
[badge-travis-link]: https://travis-ci.org/clebert/pageobject
[badge-typescript-image]: https://img.shields.io/badge/TypeScript-ready-blue.svg
[badge-typescript-link]: https://www.typescriptlang.org/
[internal-api-flexible]: https://pageobject.js.org/api/flexible/
[internal-api-flexible-protractor]: https://pageobject.js.org/api/flexible-protractor/
[internal-api-flexible-puppeteer]: https://pageobject.js.org/api/flexible-puppeteer/
[internal-api-flexible-selenium]: https://pageobject.js.org/api/flexible-selenium/
[internal-api-reliable]: https://pageobject.js.org/api/reliable/
[internal-api-stable]: https://pageobject.js.org/api/stable/
[internal-example-code-getting-started]: https://github.com/clebert/pageobject/tree/master/docs/examples/getting-started/index.js
[internal-example-docs-todo-mvc]: https://pageobject.js.org/examples/todo-mvc/
[internal-example-image-todo-mvc]: https://pageobject.js.org/examples/todo-mvc/images/todo-mvc.png
[internal-license]: https://github.com/clebert/pageobject/blob/master/LICENSE
[external-example-domain]: http://example.com/
[external-pageobject]: https://martinfowler.com/bliki/PageObject.html
[external-protractor]: https://www.protractortest.org/#/
[external-puppeteer]: https://github.com/GoogleChrome/puppeteer/blob/master/README.md
[external-selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
