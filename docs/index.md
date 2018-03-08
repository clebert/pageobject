# PageObjectJS

* [Getting started](#getting-started)
* [Tutorial: TodoMVC](#tutorial-todomvc)
* [API documentation](#api-documentation)

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

## Tutorial: TodoMVC

In this tutorial we write a test case for the TodoMVC application.
We will create several page objects and learn about different design principles.

**You can find the step-by-step instructions [here](./examples/todo-mvc/index.md).**

![todo-mvc](./examples/todo-mvc/images/todo-mvc.png)

## API documentation

* [@pageobject/reliable](./api/reliable/index.html)
* [@pageobject/stable](./api/stable/index.html)
* [@pageobject/flexible](./api/flexible/index.html)
* [@pageobject/flexible-protractor](./api/flexible-protractor/index.html)
* [@pageobject/flexible-puppeteer](./api/flexible-puppeteer/index.html)
* [@pageobject/flexible-selenium](./api/flexible-selenium/index.html)

[internal-example-code-getting-started]: https://github.com/clebert/pageobject/tree/master/docs/examples/getting-started/index.js
[external-example-domain]: http://example.com/
