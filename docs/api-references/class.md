# API Reference: @pageobject/class

A class-based implementation of the [Page Object Pattern](../guides/page-object-pattern.md) for JavaScript.

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

A page class is considered loaded if its declared initial components are found and its declared URL matches the current one.

**Parameters:**

- [`Page: PageClass`](#pageclass) The class of the page to load.
- [`adapter: Adapter`](#adapter) The adapter for connecting a page object to a specific browser automation library.

**Returns:** `Promise<Page>` A promise that will resolve to an instance of the specified page class.

### Instance Variable `protected this.adapter`

The adapter associated with this page object.

**Type:** [`adapter: Adapter`](#adapter)

### Instance Method `protected this.findSelf()`

```js
const element = await myPage.findSelf();
```

Schedules a command to find the underlying DOM element of this component.
The method will traverse up the components' ancestors to get the element path.

If no element is found, an error is thrown.

**Parameters:** None.

**Returns:** [`Promise<Element>`](#element) A promise that will resolve to the underlying DOM element of this component.

### Instance Method `protected this.findFirstDescendant(selector, predicate?)`

```js
const element = await myPage.findFirstDescendant('div');
```

Schedules a command to find the specified descendant DOM element of this component.
The method will traverse up the components' ancestors to get the element path.

If multiple elements are found, the first one is returned.

If no element is found, an error is thrown.

**Parameters:**

- `selector: string` The search criteria for an element must be defined using a CSS selector.
- [`predicate?: Predicate`](#predicate) You may also provide a custom predicate function as an additional search criteria.

**Returns:** [`Promise<Element>`](#element) A promise that will resolve to the specified descendant DOM element of this component.

### Instance Method `protected this.findUniqueDescendant(selector, predicate?)`

```js
const element = await myPage.findUniqueDescendant('div');
```

Schedules a command to find the specified descendant DOM element of this component.
The method will traverse up the components' ancestors to get the element path.

If no **unique** element is found, an error is thrown.

**Parameters:**

- `selector: string` The search criteria for an element must be defined using a CSS selector.
- [`predicate?: Predicate`](#predicate) You may also provide a custom predicate function as an additional search criteria.

**Returns:** [`Promise<Element>`](#element) A promise that will resolve to the specified descendant DOM element of this component.

### Instance Method `protected this.selectFirstDescendant(Component, predicate?)`

```js
const component = myPage.selectFirstDescendant(MyComponent);
```

Selects the specified descendant component of this component.
If the selected component points to multiple DOM elements, the first one is selected during an element search.

**Parameters:**

- [`Component: ComponentClass`](#componentclass) The class of the component to select.
- [`predicate?: Predicate`](#predicate) You may also provide a custom predicate function as an additional selection criteria.

**Returns:** `Component` An instance of the specified component class.

### Instance Method `protected this.selectUniqueDescendant(Component, predicate?)`

```js
const component = myPage.selectUniqueDescendant(MyComponent);
```

Selects the specified descendant component of this component.
If the selected component points to multiple DOM elements,
an error is thrown during an element search.

**Parameters:**

- [`Component: ComponentClass`](#componentclass) The class of the component to select.
- [`predicate?: Predicate`](#predicate) You may also provide a custom predicate function as an additional selection criteria.

**Returns:** `Component` An instance of the specified component class.

### Instance Method `protected this.goto(Page)`

```js
const myOtherPage = await myPage.goto(MyOtherPage);
```

Instantiates the specified page class when loaded, throws an error otherwise.

A page class is considered loaded if its declared initial components are found and its declared URL matches the current one.

**Parameters:**

- [`Page: PageClass`](#pageclass) The class of the page to load.

**Returns:** `Promise<Page>` A promise that will resolve to an instance of the specified page class.

## Type `Adapter`

An adapter connects a page object to a specific browser automation library.

The following adapters are currently available:

- @pageobject/selenium-adapter → [`SeleniumAdapter`](selenium-adapter.md#class-seleniumadapter)

## Type `PageClass`

```js
// TypeScript
class MyPage extends PageObject<SomeElement, SomeAdapter> {
  public static InitialComponents = [MyComponent];
  public static url = /example\.com/;

  // ...
}

// JavaScript
class MyPage extends PageObject {
  // ...
}

MyPage.InitialComponents = [];
MyPage.url = /example\.com/;
```

A page class declares a concrete page type, it has two required properties:

- [`PageClass.InitialComponents: ComponentClass[]`](#componentclass)
- `PageClass.url: RegExp | string`

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

A component class declares a concrete component type, it has one required property:

- `ComponentClass.selector: string`

## Type `Element`

The type of an element depends on the adapter used:

- @pageobject/selenium-adapter → [`WebElement`][selenium-webelement]

## Type `Predicate`

```js
// TypeScript
function atIndex(n: number): Predicate<SomeElement> {
  return async (element, index) => index === n;
}

// JavaScript
function atIndex(n) {
  return async (element, index) => index === n;
}
```

```js
const element = await myPage.findFirstDescendant('div', atIndex(1));
```

A predicate function takes as input an element and its index and returns a promise that will resolve to a boolean.
In addition to a CSS selector, it is another search criteria for selecting a specific component or finding a specific DOM element.

[selenium-webelement]: http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebElement.html
