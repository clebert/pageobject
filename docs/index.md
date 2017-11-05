> If you have WebDriver APIs in your test methods, You're Doing It Wrong.
>
> -- [Simon Stewart][simon-stewart]

PageObjectJS is a class-based implementation of the [Page Object pattern][docs-guides-page-object-pattern] for JavaScript.
It allows you to write **readable**, **stable**, and **maintainable** automated E2E tests using a simple but powerful [API][docs-api-references].

Your tests can be written using any browser automation framework, all you need is an appropriate adapter.
An adapter connects a specific browser automation library with [@pageobject/class][package-class].

The following adapters are currently available:

- [@pageobject/selenium-adapter][package-selenium-adapter] → [Selenium][selenium]

**This implementation is inspired by a Facebook talk at the SeleniumConf Berlin 2017.**

[![Facebook Talk][facebook-talk-image]][facebook-talk-video]

[docs-api-references]: https://github.com/clebert/pageobject/blob/master/docs/api-references/index.md
[docs-guides-page-object-pattern]: https://github.com/clebert/pageobject/blob/master/docs/guides/page-object-pattern.md

[package-class]: https://github.com/clebert/pageobject/tree/master/@pageobject/class
[package-selenium-adapter]: https://github.com/clebert/pageobject/tree/master/@pageobject/selenium-adapter

[facebook-talk-image]: http://img.youtube.com/vi/diYgXpktTqo/0.jpg
[facebook-talk-video]: https://youtu.be/diYgXpktTqo
[simon-stewart]: https://twitter.com/shs96c
[selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
