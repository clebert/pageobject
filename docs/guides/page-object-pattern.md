# Page Object Pattern: The Key to Maintainable E2E Tests

> If you have WebDriver APIs in your test methods, You're Doing It Wrong.
>
> -- [Simon Stewart][simon-stewart]

## Overview

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Implementation Notes](#implementation-notes)
- [Related Links](#related-links)

## The Problem

When you are writing E2E tests a major part of your code will consist of interactions with the DOM. After fetching elements you will verify some state of the element through various assertions and move on to fetching the next element.

Even with a simple test, readability is very poor. There is a lot of code, that obscures the purpose of the test, making it slow and difficult to digest.

It is common that both minor and major changes to the UI is implemented frequently. This could be a new design, restructuring of fields and buttons, and this will likely impact your test. So your test fails and you need to update your selectors.

So some of the typical problems for this type of E2E test are:

- Test cases are difficult to read
- Changes in the UI breaks multiple tests often in several places
- Duplication of selectors both inside and across tests - no reuse

## The Solution

To combat these problems, there is a concept called the **Page Object pattern**.

At its core, the Page Object pattern is a specialized form of the [Facade pattern][facade-pattern]. If you are unfamiliar with the facade pattern, it means hiding bad APIs behind better ones.

So instead of having each test fetch elements directly and being fragile towards UI changes, the Page Object pattern introduces what is basically a decoupling layer.

You create an object that represents the UI you want to test, which could be a whole page or a significant part of it. The responsibility of this object is to wrap HTML elements and encapsulate interactions with the UI. And this is the only place you need to modify when the UI changes.

The essential principle is that there is only one place in your test suite that knows the structure of the HTML of a particular page or component.

## Implementation Notes

- **The public methods represent the services that the page offers:**

  A page object should allow a software client to do anything and see anything that a human can.

- **Try not to expose the internals of the page:**

  Some of the hierarchy of a complex UI is only there in order to structure the UI, such composite structures shouldn't be revealed by the page objects.

- **Generally don't make assertions:**

  Page objects are commonly used for testing, but should not make assertions themselves. Their responsibility is to provide access to the state of the underlying page. It's up to test clients to carry out the assertion logic.

- **Methods return other page objects:**

  This means that you can effectively model the user's journey through your application.

- **Need not represent an entire page:**

  Despite the term "page" object, these objects shouldn't usually be built for each page, but rather for the significant elements on a page.

- **Different results for the same action are modelled as different methods:**

  It may be necessary to model (for example) both a successful and unsuccessful login.

## Related Links

- [Readable. Stable. Maintainable. E2E Testing @ Facebook][facebook-talk-video]
- [Martin Fowler: PageObject][martin-fowler-page-object]
- [Selenium: PageObjects][selenium-page-objects]
- [Justin Abrahms: Selenium's Page Object Pattern][justin-abrah-selenium-page-object-pattern]
- [Kim Schiller: Getting started with Page Object Pattern for your Selenium tests][kim-schiller-page-object-pattern]

[facade-pattern]: https://en.wikipedia.org/wiki/Facade_pattern
[facebook-talk-video]: https://youtu.be/diYgXpktTqo
[justin-abrah-selenium-page-object-pattern]: https://justin.abrah.ms/python/selenium-page-object-pattern--the-key-to-maintainable-tests.html
[kim-schiller-page-object-pattern]: https://www.pluralsight.com/guides/software-engineering-best-practices/getting-started-with-page-object-pattern-for-your-selenium-tests
[martin-fowler-page-object]: https://martinfowler.com/bliki/PageObject.html
[selenium-page-objects]: https://github.com/SeleniumHQ/selenium/wiki/PageObjects
[simon-stewart]: https://twitter.com/shs96c
