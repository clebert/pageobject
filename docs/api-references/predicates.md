# API Reference: @pageobject/predicates

A collection of useful [predicate](class.md#type-predicate) functions.

## Installation

```sh
npm install @pageobject/class @pageobject/predicates
```

## Overview

- [Predicates](#predicates)
  - [Function `predicates.not(predicate)`](#function-predicatesnotpredicate)
  - [Function `predicates.and(predicateA, predicateB)`](#function-predicatesandpredicatea-predicateb)
  - [Function `predicates.or(predicateA, predicateB)`](#function-predicatesorpredicatea-predicateb)
  - [Function `predicates.xor(predicateA, predicateB)`](#function-predicatesxorpredicatea-predicateb)
  - [Function `predicates.atIndex(n)`](#function-predicatesatindexn)
  - [Function `predicates.attributeContains(name, value)`](#function-predicatesattributecontainsname-value)
  - [Function `predicates.attributeEquals(name, value)`](#function-predicatesattributeequalsname-value)
  - [Function `predicates.attributeMatches(name, value)`](#function-predicatesattributematchesname-value)
  - [Function `predicates.htmlContains(html)`](#function-predicateshtmlcontainshtml)
  - [Function `predicates.htmlEquals(html)`](#function-predicateshtmlequalshtml)
  - [Function `predicates.htmlMatches(html)`](#function-predicateshtmlmatcheshtml)
  - [Function `predicates.textContains(text)`](#function-predicatestextcontainstext)
  - [Function `predicates.textEquals(text)`](#function-predicatestextequalstext)
  - [Function `predicates.textMatches(text)`](#function-predicatestextmatchestext)

## Predicates

```js
// ES2015 / TypeScript
import * as predicates from '@pageobject/predicates';

// CommonJS
const predicates = require('@pageobject/predicates');
```

### Function `predicates.not(predicate)`

```js
const {not} = predicates;

const element = await myPage.findUniqueDescendant('p', not(textContains('foo')));
```

**Truth table:**

| A | NOT A |
| - | ----- |
| 0 | 1     |
| 1 | 0     |

**Parameters:**

- [`predicate: Predicate`](class.md#type-predicate) The predicate to negate.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.and(predicateA, predicateB)`

```js
const {and} = predicates;

const element = await myPage.findUniqueDescendant('p', and(textContains('foo'), textContains('bar')));
```

**Truth table:**

| A | B | A AND B |
| - | - | ------- |
| 0 | 0 | 0       |
| 0 | 1 | 0       |
| 1 | 0 | 0       |
| 1 | 1 | 1       |

**Parameters:**

- [`predicateA: Predicate`](class.md#type-predicate) The predicate A.
- [`predicateB: Predicate`](class.md#type-predicate) The predicate B.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.or(predicateA, predicateB)`

```js
const {or} = predicates;

const element = await myPage.findUniqueDescendant('p', or(textContains('foo'), textContains('bar')));
```

**Truth table:**

| A | B | A OR B |
| - | - | ------ |
| 0 | 0 | 0      |
| 0 | 1 | 1      |
| 1 | 0 | 1      |
| 1 | 1 | 1      |

**Parameters:**

- [`predicateA: Predicate`](class.md#type-predicate) The predicate A.
- [`predicateB: Predicate`](class.md#type-predicate) The predicate B.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.xor(predicateA, predicateB)`

```js
const {xor} = predicates;

const element = await myPage.findUniqueDescendant('p', xor(textContains('foo'), textContains('bar')));
```

**Truth table:**

| A | B | A XOR B |
| - | - | ------- |
| 0 | 0 | 0       |
| 0 | 1 | 1       |
| 1 | 0 | 1       |
| 1 | 1 | 0       |

**Parameters:**

- [`predicateA: Predicate`](class.md#type-predicate) The predicate A.
- [`predicateB: Predicate`](class.md#type-predicate) The predicate B.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.atIndex(n)`

```js
const {atIndex} = predicates;

const element = await myPage.findUniqueDescendant('div', atIndex(1));
```

**Parameters:**

- `n: number` The expected index.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.htmlContains(html)`

```js
const {htmlContains} = predicates;

const element = await myPage.findFirstDescendant('div', htmlContains('<p>example</p>'));
```

Compares against the innerHTML of an element, including sub-elements, without any leading or trailing whitespace.

**Parameters:**

- `html: string` The expected sub-html.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.htmlEquals(html)`

```js
const {htmlEquals} = predicates;

const element = await myPage.findFirstDescendant('div', htmlEquals('<p>example</p>'));
```

Compares against the innerHTML of an element, including sub-elements, without any leading or trailing whitespace.

**Parameters:**

- `html: string` The expected html.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.htmlMatches(html)`

```js
const {htmlMatches} = predicates;

const element = await myPage.findFirstDescendant('div', htmlMatches(/<p>example<\/p>/));
```

Compares against the innerHTML of an element, including sub-elements, without any leading or trailing whitespace.

**Parameters:**

- `html: RegExp` The expected html pattern.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.attributeContains(name, value)`

```js
const {attributeContains} = predicates;

const element = await myPage.findFirstDescendant('div', attributeContains('id', 'example'));
```

Compares against the value of the specified attribute of an element, without any leading or trailing whitespace.

**Parameters:**

- `name: string` The name of the attribute.
- `value: string` The expected sub-value.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.attributeEquals(name, value)`

```js
const {attributeEquals} = predicates;

const element = await myPage.findFirstDescendant('div', attributeEquals('id', 'example'));
```

Compares against the value of the specified attribute of an element, without any leading or trailing whitespace.

**Parameters:**

- `name: string` The name of the attribute.
- `value: string` The expected value.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.attributeMatches(name, value)`

```js
const {attributeMatches} = predicates;

const element = await myPage.findFirstDescendant('div', attributeMatches('id', /example/));
```

Compares against the value of the specified attribute of an element, without any leading or trailing whitespace.

**Parameters:**

- `name: string` The name of the attribute.
- `value: RegExp` The expected value pattern.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.textContains(text)`

```js
const {textContains} = predicates;

const element = await myPage.findFirstDescendant('div', textContains('example'));
```

Compares against the visible (i.e. not hidden by CSS) innerText of an element, including sub-elements, without any leading or trailing whitespace.

**Parameters:**

- `text: string` The expected sub-text.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.textEquals(text)`

```js
const {textEquals} = predicates;

const element = await myPage.findFirstDescendant('div', textEquals('example'));
```

Compares against the visible (i.e. not hidden by CSS) innerText of an element, including sub-elements, without any leading or trailing whitespace.

**Parameters:**

- `text: string` The expected text.

**Returns:** [`Predicate`](class.md#type-predicate)

### Function `predicates.textMatches(text)`

```js
const {textMatches} = predicates;

const element = await myPage.findFirstDescendant('div', textMatches(/example/));
```

Compares against the visible (i.e. not hidden by CSS) innerText of an element, including sub-elements, without any leading or trailing whitespace.

**Parameters:**

- `text: RegExp` The expected text pattern.

**Returns:** [`Predicate`](class.md#type-predicate)

[puppeteer]: https://github.com/GoogleChrome/puppeteer
[selenium]: http://seleniumhq.github.io/selenium/docs/api/javascript/index.html
