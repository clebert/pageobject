# API Reference: @pageobject/selenium-adapter

An adapter for connecting page objects to [Selenium][selenium].

## Installation

```sh
npm install \
  @pageobject/class \
  @pageobject/selenium-adapter \
  selenium-webdriver
```

If you use [TypeScript][typescript], please install the types for Selenium as well:

```sh
npm install @types/selenium-webdriver
```

## Overview

- [Class `SeleniumAdapter`](#class-seleniumadapter)
  - [Static Method `public SeleniumAdapter.launchHeadlessChrome()`](#static-method-public-seleniumadapterlaunchheadlesschrome)
  - [Constructor Method `new SeleniumAdapter(driver)`](#constructor-method-new-seleniumadapterdriver)
  - [Instance Variable `public this.driver`](#instance-variable-public-thisdriver)
  - [Instance Method `public this.open(Page, url)`](#instance-method-public-thisopenpage-url)
- [Predicates](#predicates)
  - [Function `predicates.atIndex(n)`](#function-predicatesatindexn)
  - [Function `predicates.textEquals(value)`](#function-predicatestextequalsvalue)

## Class `SeleniumAdapter`

```js
// ES2015 / TypeScript
import {SeleniumAdapter} from '@pageobject/selenium-adapter';

// CommonJS
const {SeleniumAdapter} = require('@pageobject/selenium-adapter');
```

### Static Method `public SeleniumAdapter.launchHeadlessChrome()`

```js
const adapter = await SeleniumAdapter.launchHeadlessChrome();
```

Creates a new WebDriver session to control a headless Chrome.

**Parameters:** None.

**Returns:** `Promise<SeleniumAdapter>`

### Constructor Method `new SeleniumAdapter(driver)`

```js
const driver = await new Builder().forBrowser('chrome').build();
const adapter = new SeleniumAdapter(driver);
```

Please refer to the ["Using the Builder API"][selenium] documentation for instructions on creating a WebDriver instance.

**Parameters:**

- [`driver: WebDriver`][selenium-webdriver] The WebDriver instance that provides automated control over a browser session.

### Instance Variable `public this.driver`

The WebDriver instance associated with this adapter.

**Type:** [`driver: WebDriver`][selenium-webdriver]

### Instance Method `public this.open(Page, url)`

```js
const myPage = await adapter.open(MyPage, 'https://example.com/');
```

Schedules a command to navigate to the specified URL, and then instantiates the specified page class when loaded, throws an error otherwise.

- A page class is considered loaded if each of its declared selectors point to at least one existing DOM element and its declared URL matches the current one.
- When searching for a DOM element, the method polls the DOM until the element has been found, or the timeout expires. The timeout can be configured using the environment variable `ELEMENT_SEARCH_TIMEOUT`, it defaults to `5000` milliseconds.
- **Please make sure Selenium's [implicit wait timeout][selenium-timeouts] is set to `0` (its default value).**

**Parameters:**

- [`Page: PageClass`](class.md#type-pageclass) The class of the page to load.
- `url: string` The URL to navigate to.

**Returns:** `Promise<Page>` A promise that will resolve to an instance of the specified page class.

## Predicates

```js
// ES2015 / TypeScript
import {predicates} from '@pageobject/selenium-adapter';

// CommonJS
const {predicates} = require('@pageobject/selenium-adapter');
```

### Function `predicates.atIndex(n)`

```js
const {atIndex} = predicates;
const element = await myPage.findFirstDescendant('div', atIndex(1));
```

**Parameters:**

- `n: number` The expected index.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.textEquals(value)`

```js
const {textEquals} = predicates;
const element = await myPage.findFirstDescendant('div', textEquals('example'));
```

Compares against the visible (i.e. not hidden by CSS) innerText of an element, including sub-elements, without any leading or trailing whitespace.

**Parameters:**

- `value: string` The expected text.

**Returns:** [`Predicate`](class.md#type-predicate)

[selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
[selenium-timeouts]: http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_Timeouts.html
[selenium-webdriver]: http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html
[typescript]: https://www.typescriptlang.org/
