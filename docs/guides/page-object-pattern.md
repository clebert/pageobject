# Page Object Pattern

A page object wraps a HTML page, or component, with an API, allowing you to manipulate page elements without digging around in the HTML.

Methods on a page object offering the "services" that a page offers rather than exposing the details and mechanics of the page.

The essential principle is that there is only one place in your test suite with knowledge of the structure of the HTML of a particular page or component.

## Overview

- [Implementation Notes](#implementation-notes)
- [Related Links](#related-links)

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

[facebook-talk-video]: https://youtu.be/diYgXpktTqo
[martin-fowler-page-object]: https://martinfowler.com/bliki/PageObject.html
[selenium-page-objects]: https://github.com/SeleniumHQ/selenium/wiki/PageObjects
