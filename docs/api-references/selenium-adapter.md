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
  - [Static Method `public SeleniumBrowser.launch(capabilities)`](#static-method-public-seleniumbrowserlaunchcapabilities)
  - [Static Method `public SeleniumBrowser.launchHeadlessChrome()`](#static-method-public-seleniumbrowserlaunchheadlesschrome)
  - [Constructor Method `new SeleniumBrowser(driver, adapter)`](#constructor-method-new-seleniumbrowserdriver-adapter)
  - [Instance Variable `public this.adapter`](#instance-variable-public-thisadapter)
  - [Instance Method `public this.open(Page, url)`](#instance-method-public-thisopenpage-url)
  - [Instance Method `public this.quit()`](#instance-method-public-thisquit)
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

**Parameters:**

- [`driver: WebDriver`][selenium-webdriver] An instance of the Selenium WebDriver.

### Instance Variable `public this.driver`

The Selenium WebDriver instance associated with this adapter.

**Type:** [`driver: WebDriver`][selenium-webdriver]

## Class `SeleniumBrowser`

```js
// ES2015 / TypeScript
import {SeleniumBrowser} from '@pageobject/selenium-adapter';

// CommonJS
const {SeleniumBrowser} = require('@pageobject/selenium-adapter');
```

### Static Method `public SeleniumBrowser.launch(capabilities)`

```js
const browser = await SeleniumBrowser.launch({browserName: 'chrome'});
```

Creates a new WebDriver session based on the specified capabilities.

**Parameters:**

- [`capabilities: Capabilities`][selenium-capabilities] A set of capabilities for the new WebDriver session.

**Returns:** `Promise<SeleniumBrowser>`

### Static Method `public SeleniumBrowser.launchHeadlessChrome()`

```js
const browser = await SeleniumBrowser.launchHeadlessChrome();
```

Creates a new WebDriver session to control a headless Chrome.

**Parameters:** None.

**Returns:** `Promise<SeleniumBrowser>`

### Constructor Method `new SeleniumBrowser(driver, adapter)`

```js
const driver = await new Builder().forBrowser('chrome').build();
const adapter = new SeleniumAdapter(driver);
const browser = new SeleniumBrowser(driver, adapter);
```

**Parameters:**

- [`driver: WebDriver`][selenium-webdriver] An instance of the Selenium WebDriver.
- [`adapter: SeleniumAdapter`](#class-seleniumadapter) The adapter for connecting a page object to Selenium WebDriver.

### Instance Variable `public this.adapter`

The adapter associated with this browser abstraction.

**Type:** [`adapter: SeleniumAdapter`](#class-seleniumadapter)

### Instance Method `public this.open(Page, url)`

```js
const myPage = await browser.open(MyPage, 'https://example.com/');
```

Schedules a command to navigate to the specified URL, and then waits for the specified page to load.
A page is considered loaded as soon as the initial components declared on the page class are found and the declared URL matches the current one.

The timeout for the navigation must be configured via Selenium, it usually defaults to 30 seconds.

The timeout for waiting for the page to load defaults to 10 seconds and can be configured using the `PAGEOBJECT_TIMEOUT` environment variable:

```js
process.env.PAGEOBJECT_TIMEOUT = 30000; // 30 seconds
```

**Parameters:**

- [`Page: PageClass`](class.md#pageclass) The class of the page to load.
- `url: string` The URL to navigate to.

**Returns:** `Promise<Page>` A promise that will resolve to an instance of the specified page class.

### Instance Method `public this.quit()`

```js
await browser.quit();
```

Terminates the browser session. After calling quit, the Selenium WebDriver instance associated with this browser abstraction will be invalidated and may no longer be used to issue commands against the browser.

**Parameters:** None.

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
[selenium-capabilities]: http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_Capabilities.html
[selenium-webdriver]: http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html
[typescript]: https://www.typescriptlang.org/
