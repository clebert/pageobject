[**Getting Started**][repo-getting-started] | [**API References**][repo-api-references] | [**Examples**][repo-examples] | [**Guides**][repo-guides]

PageObjectJS is a class-based implementation of the [Page Object pattern][repo-guides-page-object-pattern] for JavaScript.
It allows you to write **readable**, **stable**, and **maintainable** automated E2E tests using a simple but powerful [API][repo-api-references].

Your tests can be written using any browser automation framework, all you need is an appropriate adapter.
An adapter connects a specific browser automation library with [@pageobject/class][repo-package-class].

The following adapters are currently available:

- [@pageobject/selenium-adapter][repo-package-selenium-adapter] → [Selenium][selenium]

**PageObjectJS is inspired by a Facebook talk at the SeleniumConf Berlin.**

[![Facebook Talk][facebook-talk-image]][facebook-talk-video]

[repo-api-references]: https://github.com/clebert/pageobject/blob/master/docs/api-references/index.md
[repo-examples]: https://github.com/clebert/pageobject/blob/master/docs/examples/index.md
[repo-getting-started]: https://github.com/clebert/pageobject#getting-started
[repo-guides]: https://github.com/clebert/pageobject/blob/master/docs/guides/index.md
[repo-guides-page-object-pattern]: https://github.com/clebert/pageobject/blob/master/docs/guides/page-object-pattern.md
[repo-package-class]: https://github.com/clebert/pageobject/tree/master/@pageobject/class
[repo-package-selenium-adapter]: https://github.com/clebert/pageobject/tree/master/@pageobject/selenium-adapter

[facebook-talk-image]: http://img.youtube.com/vi/diYgXpktTqo/0.jpg
[facebook-talk-video]: https://youtu.be/diYgXpktTqo
[selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
