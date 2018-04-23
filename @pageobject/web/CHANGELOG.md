# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="11.1.0"></a>
# [11.1.0](https://github.com/clebert/pageobject/compare/v11.0.0...v11.1.0) (2018-04-23)




**Note:** Version bump only for package @pageobject/web

<a name="11.0.0"></a>
# [11.0.0](https://github.com/clebert/pageobject/compare/v10.0.0...v11.0.0) (2018-04-22)




**Note:** Version bump only for package @pageobject/web

<a name="10.0.0"></a>
# [10.0.0](https://github.com/clebert/pageobject/compare/v9.1.0...v10.0.0) (2018-04-22)


### Features

* **all:** improving the usability and readability of the api ([#213](https://github.com/clebert/pageobject/issues/213)) ([6a22eeb](https://github.com/clebert/pageobject/commit/6a22eeb))
* **all:** move effector from component to web component ([#215](https://github.com/clebert/pageobject/issues/215)) ([cd77b49](https://github.com/clebert/pageobject/commit/cd77b49))


### BREAKING CHANGES

* **all:** Moved the `getNodeCount` method from the `Component` class to the `WebComponent` class.
* **all:** Simplified the adapter concept and replaced the `WebBrowser` class with the `Keyboard` and `Page` classes.




<a name="9.1.0"></a>
# [9.1.0](https://github.com/clebert/pageobject/compare/v9.0.0...v9.1.0) (2018-04-21)


### Features

* **web:** add new effect getters to the web component ([#211](https://github.com/clebert/pageobject/issues/211)) ([e919b8d](https://github.com/clebert/pageobject/commit/e919b8d))




<a name="9.0.0"></a>
# [9.0.0](https://github.com/clebert/pageobject/compare/v8.0.0...v9.0.0) (2018-04-20)


### Features

* **base:** make component selector non-static ([#209](https://github.com/clebert/pageobject/issues/209)) ([100dad6](https://github.com/clebert/pageobject/commit/100dad6))
* **base:** the test class quits the adapter ([#210](https://github.com/clebert/pageobject/issues/210)) ([66cd8ee](https://github.com/clebert/pageobject/commit/66cd8ee))


### BREAKING CHANGES

* **base:** The `select` method of the `Component` class is removed and the `selector` property of the `Component` class is now abstract instead of static.




<a name="8.0.0"></a>
# [8.0.0](https://github.com/clebert/pageobject/compare/v7.0.0...v8.0.0) (2018-04-19)




**Note:** Version bump only for package @pageobject/web

<a name="7.0.0"></a>
# [7.0.0](https://github.com/clebert/pageobject/compare/v6.0.0...v7.0.0) (2018-04-19)




**Note:** Version bump only for package @pageobject/web

<a name="6.0.0"></a>
# [6.0.0](https://github.com/clebert/pageobject/compare/v5.0.0...v6.0.0) (2018-04-18)


### Features

* **all:** change visibility of some methods ([#198](https://github.com/clebert/pageobject/issues/198)) ([d9cfbc8](https://github.com/clebert/pageobject/commit/d9cfbc8))
* **all:** general api improvements ([#201](https://github.com/clebert/pageobject/issues/201)) ([d1ca24a](https://github.com/clebert/pageobject/commit/d1ca24a))
* **web:** remove default selector from web component class ([#199](https://github.com/clebert/pageobject/issues/199)) ([26232cb](https://github.com/clebert/pageobject/commit/26232cb))
* **web:** trim the text of a web component ([#200](https://github.com/clebert/pageobject/issues/200)) ([d8d188f](https://github.com/clebert/pageobject/commit/d8d188f))


### BREAKING CHANGES

* **all:** Breaking API changes to the `TestStep` and `WebComponent` classes
* **web:** Each web component requires its own selector.




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
