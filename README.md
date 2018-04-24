# PageObjectJS

[![Build Status][badge-travis-image]][badge-travis-link]
[![Coverage Status][badge-coveralls-image]][badge-coveralls-link]
[![TypeScript][badge-typescript-image]][badge-typescript-link]

> A platform- and framework-independent UI test automation library.

## Getting started

You can find the **complete code** of all examples [here](https://github.com/clebert/pageobject/blob/master/docs/examples/).
To run them, you need Node.js version 8 or higher.

### Example 1: Writing your first automated web UI test

In this example we write a test which opens the website [example.com](http://example.com/) and asserts its page title:

```js
function example(test, app) {
  test
    .perform(app.page.goto('http://example.com/'))
    .assert(app.page.getTitle(), is('Example Domain'));
}
```

We also need to write our first component, which currently serves only to give us access to its page object:

```js
// ES2015 notation
class App extends WebComponent {
  get selector() {
    return ':root';
  }
}
```

```js
// TypeScript/Babel notation
class App extends WebComponent {
  selector = ':root';
}
```

The test is performed in Node.js without a real browser using [jsdom][external-jsdom]:

```js
const adapter = new JSDOMAdapter();

await Test.run(new App(adapter), 10, example);
```

### Example 2: Using a real browser

To use a real browser instead of jsdom, we have to choose another adapter.

Adapters for the following test automation solutions are currently available:

* [Puppeteer][internal-api-puppeteer]
* [Selenium][internal-api-selenium-webdriver]
* [Protractor][internal-api-protractor]

We only need to change one line to run the above test in a headless Chrome:

```js
const adapter = await PuppeteerAdapter.create();
```

### Example 3: Writing and using another component

Next we write a component for the "more information" link:

```js
class Link extends WebComponent {
  get selector() {
    return 'a';
  }
}
```

We declare the link as a descendant of the app component:

```js
class App extends WebComponent {
  get selector() {
    return ':root';
  }

  get moreInformationLink() {
    return new Link(this.adapter, this);
  }
}
```

Now we extend our existing test so that it asserts the link text and then clicks on the link:

```js
function example(test, app) {
  test
    .perform(app.page.goto('http://example.com/'))
    .assert(app.page.getTitle(), is('Example Domain'))
    .assert(app.moreInformationLink.getText(), is('More information...'))
    .perform(app.moreInformationLink.click());
}
```

## Further examples

### [@pageobject/todomvc][internal-api-todomvc]

An exemplary test suite for the popular TodoMVC application.

## Packages

### [@pageobject/base][internal-api-base]

A declarative API as a **basis** for platform- and framework-independent UI test automation.

### [@pageobject/web][internal-api-web]

A declarative API for framework-independent **web** UI test automation.

### [@pageobject/protractor][internal-api-protractor]

A web API adapter for Protractor.

### [@pageobject/puppeteer][internal-api-puppeteer]

A web API adapter for Puppeteer.

### [@pageobject/selenium-webdriver][internal-api-selenium-webdriver]

A web API adapter for Selenium.

---

Copyright (c) 2017-present, Clemens Akens. Released under the terms of the [MIT License][internal-license].

[badge-coveralls-image]: https://coveralls.io/repos/github/clebert/pageobject/badge.svg?branch=master
[badge-coveralls-link]: https://coveralls.io/github/clebert/pageobject?branch=master
[badge-travis-image]: https://travis-ci.org/clebert/pageobject.svg?branch=master
[badge-travis-link]: https://travis-ci.org/clebert/pageobject
[badge-typescript-image]: https://img.shields.io/badge/TypeScript-ready-blue.svg
[badge-typescript-link]: https://www.typescriptlang.org/
[external-jsdom]: https://github.com/jsdom/jsdom
[internal-api-base]: https://pageobject.js.org/api/base/
[internal-api-protractor]: https://pageobject.js.org/api/protractor/
[internal-api-puppeteer]: https://pageobject.js.org/api/puppeteer/
[internal-api-selenium-webdriver]: https://pageobject.js.org/api/selenium-webdriver/
[internal-api-todomvc]: https://pageobject.js.org/api/todomvc/
[internal-api-web]: https://pageobject.js.org/api/web/
[internal-license]: https://github.com/clebert/pageobject/blob/master/LICENSE
