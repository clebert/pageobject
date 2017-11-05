# API Reference: @pageobject/class

A class-based implementation of the [Page Object pattern](../guides/page-object-pattern.md) for JavaScript.

## Installation

```sh
npm install @pageobject/class
```

## Overview

- [Class `PageObject`](#class-pageobject)
  - [Static Method `public PageObject.goto(Page, adapter)`](#static-method-public-pageobjectgotopage-adapter)
  - [Instance Variable `protected this.adapter`](#instance-variable-protected-thisadapter)
  - [Instance Method `protected this.findSelf()`](#instance-method-protected-thisfindself)
  - [Instance Method `protected this.findFirstDescendant(selector, predicate?)`](#instance-method-protected-thisfindfirstdescendantselector-predicate)
  - [Instance Method `protected this.findUniqueDescendant(selector, predicate?)`](#instance-method-protected-thisfinduniquedescendantselector-predicate)
  - [Instance Method `protected this.selectFirstDescendant(Component, predicate?)`](#instance-method-protected-thisselectfirstdescendantcomponent-predicate)
  - [Instance Method `protected this.selectUniqueDescendant(Component, predicate?)`](#instance-method-protected-thisselectuniquedescendantcomponent-predicate)
  - [Instance Method `protected this.goto(Page)`](#instance-method-protected-thisgotopage)
- [Type `Adapter`](#type-adapter)
- [Type `PageClass`](#type-pageclass)
- [Type `ComponentClass`](#type-componentclass)
- [Type `Element`](#type-element)
- [Type `Predicate`](#type-predicate)

## Class `PageObject`

```js
// ES2015 / TypeScript
import {PageObject} from '@pageobject/class';

// CommonJS
const {PageObject} = require('@pageobject/class');
```

### Static Method `public PageObject.goto(Page, adapter)`

```js
const myPage = await PageObject.goto(MyPage, someAdapter);
```

Instantiates the specified page class when loaded, throws an error otherwise.

- A page class is considered loaded if each of its declared selectors point to at least one existing DOM element and its declared URL matches the current one.
- When searching for a DOM element, the method polls the DOM until the element has been found, or the timeout expires. The timeout can be configured using the environment variable `ELEMENT_SEARCH_TIMEOUT`, it defaults to `5000` milliseconds.

**Parameters:**

- [`Page: PageClass`](#type-pageclass) The class of the page to load.
- [`adapter: Adapter`](#type-adapter) The adapter for connecting page objects to a specific browser automation library.

**Returns:** `Promise<Page>` A promise that will resolve to an instance of the specified page class.

### Instance Variable `protected this.adapter`

The adapter associated with this page object.

**Type:** [`adapter: Adapter`](#type-adapter)

### Instance Method `protected this.findSelf()`

```js
const element = await myPage.findSelf();
```

Schedules a command to find the underlying DOM element of this page object.

- If this page object represents a component then the method will traverse up the components' ancestors to get the path of the underlying DOM element.
- If this page object represents a page then the method will return the root `<HTML>` DOM element.
- If no DOM element is found, an error is thrown.
- When searching for a DOM element, the method polls the DOM until the element has been found, or the timeout expires. The timeout can be configured using the environment variable `ELEMENT_SEARCH_TIMEOUT`, it defaults to `5000` milliseconds.

**Parameters:** None.

**Returns:** [`Promise<Element>`](#type-element) A promise that will resolve to the underlying DOM element of this page object.

### Instance Method `protected this.findFirstDescendant(selector, predicate?)`

```js
const element = await myPage.findFirstDescendant('div');
```

Schedules a command to find the specified descendant DOM element of this page object.

- If this page object represents a component then the method will traverse up the components' ancestors to get the path of the specified descendant DOM element.
- If multiple DOM elements are found, the first one is returned.
- If no DOM element is found, an error is thrown.
- When searching for a DOM element, the method polls the DOM until the element has been found, or the timeout expires. The timeout can be configured using the environment variable `ELEMENT_SEARCH_TIMEOUT`, it defaults to `5000` milliseconds.

**Parameters:**

- `selector: string` The search criteria for a DOM element must be defined using a [CSS selector][css-selectors].
- [`predicate?: Predicate`](#type-predicate) You may also provide a custom predicate function as an additional search criteria.

**Returns:** [`Promise<Element>`](#type-element) A promise that will resolve to the specified descendant DOM element of this page object.

### Instance Method `protected this.findUniqueDescendant(selector, predicate?)`

```js
const element = await myPage.findUniqueDescendant('div');
```

Schedules a command to find the specified descendant DOM element of this page object.

- If this page object represents a component then the method will traverse up the components' ancestors to get the path of the specified descendant DOM element.
- If no **unique** DOM element is found, an error is thrown.
- When searching for a DOM element, the method polls the DOM until the element has been found, or the timeout expires. The timeout can be configured using the environment variable `ELEMENT_SEARCH_TIMEOUT`, it defaults to `5000` milliseconds.

**Parameters:**

- `selector: string` The search criteria for a DOM element must be defined using a [CSS selector][css-selectors].
- [`predicate?: Predicate`](#type-predicate) You may also provide a custom predicate function as an additional search criteria.

**Returns:** [`Promise<Element>`](#type-element) A promise that will resolve to the specified descendant DOM element of this page object.

### Instance Method `protected this.selectFirstDescendant(Component, predicate?)`

```js
const component = myPage.selectFirstDescendant(MyComponent);
```

Selects the specified descendant component of this component.

- If the selected component points to multiple DOM elements, the first one is selected during an element search.

**Parameters:**

- [`Component: ComponentClass`](#type-componentclass) The class of the component to select.
- [`predicate?: Predicate`](#type-predicate) You may also provide a custom predicate function as an additional selection criteria.

**Returns:** `Component` An instance of the specified component class.

### Instance Method `protected this.selectUniqueDescendant(Component, predicate?)`

```js
const component = myPage.selectUniqueDescendant(MyComponent);
```

Selects the specified descendant component of this component.

- If the selected component points to multiple DOM elements, an error is thrown during an element search.

**Parameters:**

- [`Component: ComponentClass`](#type-componentclass) The class of the component to select.
- [`predicate?: Predicate`](#type-predicate) You may also provide a custom predicate function as an additional selection criteria.

**Returns:** `Component` An instance of the specified component class.

### Instance Method `protected this.goto(Page)`

```js
const myOtherPage = await myPage.goto(MyOtherPage);
```

Instantiates the specified page class when loaded, throws an error otherwise.

- A page class is considered loaded if each of its declared selectors point to at least one existing DOM element and its declared URL matches the current one.
- When searching for a DOM element, the method polls the DOM until the element has been found, or the timeout expires. The timeout can be configured using the environment variable `ELEMENT_SEARCH_TIMEOUT`, it defaults to `5000` milliseconds.

**Parameters:**

- [`Page: PageClass`](#type-pageclass) The class of the page to load.

**Returns:** `Promise<Page>` A promise that will resolve to an instance of the specified page class.

## Type `Adapter`

An adapter connects a page object to a specific browser automation library.

The following adapters are currently available:

- @pageobject/selenium-adapter → [`SeleniumAdapter`](selenium-adapter.md#class-seleniumadapter)
- @pageobject/puppeteer-adapter → [`PuppeteerAdapter`](puppeteer-adapter.md#class-puppeteeradapter)

## Type `PageClass`

```js
// TypeScript
class MyPage extends PageObject<SomeElement, SomeAdapter> {
  public static selectors = [MyComponent.selector, 'h1'];
  public static url = /example\.com/;

  // ...
}

// JavaScript
class MyPage extends PageObject {
  // ...
}

MyPage.selectors = [MyComponent.selector, 'h1'];
MyPage.url = /example\.com/;
```

A page class declares a concrete page type, it has two required static properties:

- [`PageClass.selectors: string[]`][css-selectors] The initial CSS selectors.
- `PageClass.url: RegExp` The initial URL.

**It is recommended to specify initial CSS selectors which are unique for each page type.**

## Type `ComponentClass`

```js
// TypeScript
class MyComponent extends PageObject<SomeElement, SomeAdapter> {
  public static selector = 'div';

  // ...
}

// JavaScript
class MyComponent extends PageObject {
  // ...
}

MyComponent.selector = 'div';
```

A component class declares a concrete component type, it has one required static property:

- [`ComponentClass.selector: string`][css-selectors] The CSS selector of the components root DOM element.

## Type `Element`

The type of an object that represents a DOM element depends on the adapter used:

- @pageobject/selenium-adapter → [`WebElement`][selenium-webelement]
- @pageobject/puppeteer-adapter → [`ElementHandle`][puppeteer-elementhandle]

## Type `Predicate`

```js
// TypeScript
function atIndex(n: number): Predicate<SomeElement> {
  return async (adapter, element, index, elements) => index === n;
}

// JavaScript
function atIndex(n) {
  return async (adapter, element, index, elements) => index === n;
}
```

```js
const element = await myPage.findFirstDescendant('div', atIndex(1));
```

In addition to a [CSS selector][css-selectors], a predicate function is another search criteria for selecting a specific component or finding a specific DOM element.

**Parameters:**

- [`adapter: Adapter`](#type-adapter) The adapter associated with the current page object.
- [`element: Element`](#type-element) The current DOM element being processed in the array of found DOM elements.
- `index: number` The index of the current DOM element being processed in the array of found DOM elements.
- [`elements: Element[]`](#type-element) The array of found DOM elements.

**Returns:** `Promise<boolean>` A promise that will resolve to a boolean.

[css-selectors]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
[puppeteer-elementhandle]: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-elementhandle
[selenium-webelement]: http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebElement.html
