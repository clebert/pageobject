# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="5.0.0"></a>
# [5.0.0](https://github.com/clebert/pageobject/compare/v4.0.0...v5.0.0) (2018-04-17)


### Features

* **all:** a major redesign of the api ([#187](https://github.com/clebert/pageobject/issues/187)) ([14deb46](https://github.com/clebert/pageobject/commit/14deb46))


### BREAKING CHANGES

* **all:** Redesigned, added, or removed most of the classes.

Base:
- Redesigned Component class
- Added Predicate class
- Added TestStep class
- Removed FunctionCall class
- Removed Operation class
- Removed Operator class

Web:
- Redesigned WebBrowser class
- Redesigned WebComponent class
- Improved JSDOMAdapter class
- Improved WebAdapterTest class

Web adapters:
- Improved ProtractorAdapter class
- Improved PuppeteerAdapter class
- Improved SeleniumAdapter class




<a name="4.0.0"></a>
# [4.0.0](https://github.com/clebert/pageobject/compare/v3.0.0...v4.0.0) (2018-04-04)


### Features

* **all:** improve api usability ([#182](https://github.com/clebert/pageobject/issues/182)) ([edeeedb](https://github.com/clebert/pageobject/commit/edeeedb))
* **base:** add class function-call ([#183](https://github.com/clebert/pageobject/issues/183)) ([c0f8fe6](https://github.com/clebert/pageobject/commit/c0f8fe6))
* **base:** rename type executable to effect ([#185](https://github.com/clebert/pageobject/issues/185)) ([b9de0b7](https://github.com/clebert/pageobject/commit/b9de0b7))


### BREAKING CHANGES

* **base:** remove interface effect
* **all:** New component factory interface




<a name="3.0.0"></a>
# [3.0.0](https://github.com/clebert/pageobject/compare/v2.0.0...v3.0.0) (2018-04-04)


### Features

* **all:** a new api ([#176](https://github.com/clebert/pageobject/issues/176)) ([bedff7d](https://github.com/clebert/pageobject/commit/bedff7d))
* **all:** rename interface driver to adapter ([#179](https://github.com/clebert/pageobject/issues/179)) ([307f3fa](https://github.com/clebert/pageobject/commit/307f3fa))
* **all:** rename package main to base and add descriptions ([#178](https://github.com/clebert/pageobject/issues/178)) ([99a93a4](https://github.com/clebert/pageobject/commit/99a93a4))


### BREAKING CHANGES

* **all:** Remove packages reliable, stable, flexible, flexible-protractor, flexible-puppeteer, and flexible-selenium
