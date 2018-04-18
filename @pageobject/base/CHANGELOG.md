# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="6.0.0"></a>
# [6.0.0](https://github.com/clebert/pageobject/compare/v5.0.0...v6.0.0) (2018-04-18)


### Features

* **all:** change visibility of some methods ([#198](https://github.com/clebert/pageobject/issues/198)) ([d9cfbc8](https://github.com/clebert/pageobject/commit/d9cfbc8))
* **all:** general api improvements ([#201](https://github.com/clebert/pageobject/issues/201)) ([d1ca24a](https://github.com/clebert/pageobject/commit/d1ca24a))


### BREAKING CHANGES

* **all:** Breaking API changes to the `TestStep` and `WebComponent` classes




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
* **base:** add class operation ([#184](https://github.com/clebert/pageobject/issues/184)) ([627092c](https://github.com/clebert/pageobject/commit/627092c))
* **base:** rename type executable to effect ([#185](https://github.com/clebert/pageobject/issues/185)) ([b9de0b7](https://github.com/clebert/pageobject/commit/b9de0b7))


### BREAKING CHANGES

* **base:** remove class instruction
* **base:** remove interface effect
* **all:** New component factory interface




<a name="3.0.0"></a>
# [3.0.0](https://github.com/clebert/pageobject/compare/v2.0.0...v3.0.0) (2018-04-04)


### Features

* **all:** rename interface driver to adapter ([#179](https://github.com/clebert/pageobject/issues/179)) ([307f3fa](https://github.com/clebert/pageobject/commit/307f3fa))
* **all:** rename package main to base and add descriptions ([#178](https://github.com/clebert/pageobject/issues/178)) ([99a93a4](https://github.com/clebert/pageobject/commit/99a93a4))
* **base:** add guard to method nth of component ([#181](https://github.com/clebert/pageobject/issues/181)) ([03fbb4a](https://github.com/clebert/pageobject/commit/03fbb4a))
