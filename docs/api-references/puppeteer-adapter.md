# API Reference: @pageobject/puppeteer-adapter

An adapter for connecting page objects to [Puppeteer][puppeteer].

## Installation

```sh
npm install \
  @pageobject/class \
  @pageobject/puppeteer-adapter \
  puppeteer
```

If you use [TypeScript][typescript], please install the types for Puppeteer as well:

```sh
npm install @types/puppeteer
```

## Overview

- [Class `PuppeteerAdapter`](#class-puppeteeradapter)
  - [Static Method `public PuppeteerAdapter.launchChrome(options?)`](#static-method-public-puppeteeradapterlaunchchromeoptions)
  - [Constructor Method `new PuppeteerAdapter(browser, page)`](#constructor-method-new-puppeteeradapterbrowser-page)
  - [Instance Variable `public this.browser`](#instance-variable-public-thisbrowser)
  - [Instance Variable `public this.page`](#instance-variable-public-thispage)
  - [Instance Method `public this.open(Page, url, options?)`](#instance-method-public-thisopenpage-url-options)
- [Predicates](#predicates)
  - [Function `predicates.atIndex(n)`](#function-predicatesatindexn)
  - [Function `predicates.textEquals(value)`](#function-predicatestextequalsvalue)

## Class `PuppeteerAdapter`

```js
// ES2015 / TypeScript
import {PuppeteerAdapter} from '@pageobject/puppeteer-adapter';

// CommonJS
const {PuppeteerAdapter} = require('@pageobject/puppeteer-adapter');
```

### Static Method `public PuppeteerAdapter.launchChrome(options?)`

```js
const adapter = await PuppeteerAdapter.launchChrome();
```

The method launches a browser instance with given arguments. The browser will be closed when the parent Node.js process is closed.

**Parameters:**

- [`options?: LaunchOptions`][puppeteer-launchoptions] The set of configurable options to set on the browser.

**Returns:** `Promise<PuppeteerAdapter>`

### Constructor Method `new PuppeteerAdapter(browser, page)`

```js
const browser = await launch();
const page = await browser.newPage();

const adapter = new PuppeteerAdapter(browser, page);
```

**Parameters:**

- [`browser: Browser`][puppeteer-class-browser] The browser which is created when Puppeteer connects to a Chromium instance.
- [`page: Page`][puppeteer-class-page] The page which provides methods to interact with a single tab in Chromium.

### Instance Variable `public this.browser`

The Browser instance associated with this adapter.

**Type:** [`Browser`][puppeteer-class-browser]

### Instance Variable `public this.page`

The Page instance associated with this adapter.

**Type:** [`Page`][puppeteer-class-page]

### Instance Method `public this.open(Page, url, options?)`

```js
const myPage = await adapter.open(MyPage, 'https://example.com/');
```

Schedules a command to navigate to the specified URL, and then instantiates the specified page class when loaded, throws an error otherwise.

- A page class is considered loaded if each of its declared selectors point to at least one existing DOM element and its declared URL matches the current one.
- When searching for a DOM element, the method polls the DOM until the element has been found, or the timeout expires. The timeout can be configured using the environment variable `ELEMENT_SEARCH_TIMEOUT`, it defaults to `5000` milliseconds.

**Parameters:**

- [`Page: PageClass`](class.md#type-pageclass) The class of the page to load.
- `url: string` The URL to navigate to.
- [`options?: NavigationOptions`][puppeteer-pagegotourl-options] The set of configurable navigation options.

**Returns:** `Promise<Page>` A promise that will resolve to an instance of the specified page class.

## Predicates

```js
// ES2015 / TypeScript
import {predicates} from '@pageobject/puppeteer-adapter';

// CommonJS
const {predicates} = require('@pageobject/puppeteer-adapter');
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

[puppeteer]: https://github.com/GoogleChrome/puppeteer
[puppeteer-class-browser]: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-browser
[puppeteer-class-page]: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page
[puppeteer-launchoptions]: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
[puppeteer-pagegotourl-options]: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options
[typescript]: https://www.typescriptlang.org/
