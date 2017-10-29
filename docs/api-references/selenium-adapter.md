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
  - [Constructor Method `new SeleniumAdapter(driver)`](#constructor-method-new-seleniumadapterdriver)
  - [Instance Variable `public this.driver`](#instance-variable-public-thisdriver)
- [Class `SeleniumBrowser`](#class-seleniumbrowser)
  - [Static Method `public SeleniumBrowser.launchHeadlessChrome()`](#static-method-public-seleniumbrowserlaunchheadlesschrome)
  - [Constructor Method `new SeleniumBrowser(adapter)`](#constructor-method-new-seleniumbrowseradapter)
  - [Instance Variable `public this.adapter`](#instance-variable-public-thisadapter)
  - [Instance Method `public this.open(Page, url)`](#instance-method-public-thisopenpage-url)
  - [Instance Method `public this.quit()`](#instance-method-public-thisquit)
  - [Instance Method `public this.setElementSearchTimeout(ms)`](#instance-method-public-thissetelementsearchtimeoutms)
  - [Instance Method `public this.setPageLoadTimeout(ms)`](#instance-method-public-thissetpageloadtimeoutms)
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

## Class `SeleniumBrowser`

```js
// ES2015 / TypeScript
import {SeleniumBrowser} from '@pageobject/selenium-adapter';

// CommonJS
const {SeleniumBrowser} = require('@pageobject/selenium-adapter');
```

### Static Method `public SeleniumBrowser.launchHeadlessChrome()`

```js
const browser = await SeleniumBrowser.launchHeadlessChrome();
```

Creates a new WebDriver session to control a headless Chrome.

**Parameters:** None.

**Returns:** `Promise<SeleniumBrowser>`

### Constructor Method `new SeleniumBrowser(adapter)`

```js
const driver = await new Builder().forBrowser('chrome').build();
const adapter = new SeleniumAdapter(driver);
const browser = new SeleniumBrowser(adapter);
```

**Parameters:**

- [`adapter: SeleniumAdapter`](#class-seleniumadapter) The adapter for connecting page objects to Selenium.

### Instance Variable `public this.adapter`

The adapter associated with this browser abstraction.

**Type:** [`adapter: SeleniumAdapter`](#class-seleniumadapter)

### Instance Method `public this.open(Page, url)`

```js
const myPage = await browser.open(MyPage, 'https://example.com/');
```

Schedules a command to navigate to the specified URL, and then instantiates the specified page class when loaded, throws an error otherwise.

A page class is considered loaded if its declared initial components are found and its declared URL matches the current one.

**Parameters:**

- [`Page: PageClass`](class.md#pageclass) The class of the page to load.
- `url: string` The URL to navigate to.

**Returns:** `Promise<Page>` A promise that will resolve to an instance of the specified page class.

### Instance Method `public this.quit()`

```js
await browser.quit();
```

Terminates the browser session. After calling quit, the WebDriver instance associated with this browser abstraction will be invalidated and may no longer be used to issue commands against the browser.

**Parameters:** None.

**Returns:** `Promise<void>`

### Instance Method `public this.setElementSearchTimeout(ms)`

```js
await browser.setElementSearchTimeout(5000); // 5 seconds
```

Specifies the amount of time the driver should wait when searching for an element if it is not immediately present.

Setting the wait timeout to 0 (its default value), disables waiting, but **it is recommended to set a wait timeout greater than 0.**

**Parameters:**

- `ms: number` The amount of time to wait, in milliseconds.

**Returns:** `Promise<void>`

### Instance Method `public this.setPageLoadTimeout(ms)`

```js
await browser.setPageLoadTimeout(10000); // 10 seconds
```

Sets the amount of time to wait for a page load to complete before returning an error. If the timeout is negative, page loads may be indefinite.

**Parameters:**

- `ms: number` The amount of time to wait, in milliseconds.

**Returns:** `Promise<void>`

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

**Returns:** [Predicate](class.md#predicate)

### Function `predicates.textEquals(value)`

```js
const {textEquals} = predicates;
const element = await myPage.findFirstDescendant('div', textEquals('example'));
```

Compares against the visible (i.e. not hidden by CSS) innerText of an element, including sub-elements, without any leading or trailing whitespace.

**Parameters:**

- `value: string` The expected text.

**Returns:** [Predicate](class.md#predicate)

[selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
[selenium-webdriver]: http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html
[typescript]: https://www.typescriptlang.org/
