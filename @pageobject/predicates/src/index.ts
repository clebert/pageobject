import {PageObject, Predicate} from '@pageobject/core';

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {and} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {and} = require('@pageobject/predicates');
 * ```
 */
export function and<TElement, TPageObject extends PageObject<TElement>>(
  a: Predicate<TElement, TPageObject>,
  b: Predicate<TElement, TPageObject>
): Predicate<TElement, TPageObject> {
  return async (pageObject, index, pageObjects) =>
    (await a(pageObject, index, pageObjects)) &&
    /* tslint:disable-next-line no-return-await */
    (await b(pageObject, index, pageObjects));
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {or} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {or} = require('@pageobject/predicates');
 * ```
 */
export function or<TElement, TPageObject extends PageObject<TElement>>(
  a: Predicate<TElement, TPageObject>,
  b: Predicate<TElement, TPageObject>
): Predicate<TElement, TPageObject> {
  return async (pageObject, index, pageObjects) =>
    (await a(pageObject, index, pageObjects)) ||
    /* tslint:disable-next-line no-return-await */
    (await b(pageObject, index, pageObjects));
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {not} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {not} = require('@pageobject/predicates');
 * ```
 */
export function not<TElement, TPageObject extends PageObject<TElement>>(
  predicate: Predicate<TElement, TPageObject>
): Predicate<TElement, TPageObject> {
  return async (pageObject, index, pageObjects) =>
    !await predicate(pageObject, index, pageObjects);
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {indexEquals} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {indexEquals} = require('@pageobject/predicates');
 * ```
 */
export function indexEquals<TElement, TPageObject extends PageObject<TElement>>(
  value: number
): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index === value;
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {indexIsGreaterThan} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {indexIsGreaterThan} = require('@pageobject/predicates');
 * ```
 */
export function indexIsGreaterThan<
  TElement,
  TPageObject extends PageObject<TElement>
>(value: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index > value;
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {indexIsGreaterThanOrEquals} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {indexIsGreaterThanOrEquals} = require('@pageobject/predicates');
 * ```
 */
export function indexIsGreaterThanOrEquals<
  TElement,
  TPageObject extends PageObject<TElement>
>(value: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index >= value;
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {indexIsLessThan} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {indexIsLessThan} = require('@pageobject/predicates');
 * ```
 */
export function indexIsLessThan<
  TElement,
  TPageObject extends PageObject<TElement>
>(value: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index < value;
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {indexIsLessThanOrEquals} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {indexIsLessThanOrEquals} = require('@pageobject/predicates');
 * ```
 */
export function indexIsLessThanOrEquals<
  TElement,
  TPageObject extends PageObject<TElement>
>(value: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index <= value;
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {equals} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {equals} = require('@pageobject/predicates');
 * ```
 */
export function equals<
  TElement,
  TPageObject extends PageObject<TElement>,
  TValue
>(
  actual: (pageObject: TPageObject) => Promise<TValue>,
  expected: TValue
): Predicate<TElement, TPageObject> {
  return async pageObject => (await actual(pageObject)) === expected;
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {matches} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {matches} = require('@pageobject/predicates');
 * ```
 */
export function matches<TElement, TPageObject extends PageObject<TElement>>(
  actual: (pageObject: TPageObject) => Promise<string>,
  expected: RegExp
): Predicate<TElement, TPageObject> {
  return async pageObject => expected.test(await actual(pageObject));
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {isGreaterThan} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {isGreaterThan} = require('@pageobject/predicates');
 * ```
 */
export function isGreaterThan<
  TElement,
  TPageObject extends PageObject<TElement>
>(
  actual: (pageObject: TPageObject) => Promise<number>,
  expected: number
): Predicate<TElement, TPageObject> {
  return async pageObject => (await actual(pageObject)) > expected;
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {isGreaterThanOrEquals} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {isGreaterThanOrEquals} = require('@pageobject/predicates');
 * ```
 */
export function isGreaterThanOrEquals<
  TElement,
  TPageObject extends PageObject<TElement>
>(
  actual: (pageObject: TPageObject) => Promise<number>,
  expected: number
): Predicate<TElement, TPageObject> {
  return async pageObject => (await actual(pageObject)) >= expected;
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {isLessThan} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {isLessThan} = require('@pageobject/predicates');
 * ```
 */
export function isLessThan<TElement, TPageObject extends PageObject<TElement>>(
  actual: (pageObject: TPageObject) => Promise<number>,
  expected: number
): Predicate<TElement, TPageObject> {
  return async pageObject => (await actual(pageObject)) < expected;
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {isLessThanOrEquals} from '@pageobject/predicates';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {isLessThanOrEquals} = require('@pageobject/predicates');
 * ```
 */
export function isLessThanOrEquals<
  TElement,
  TPageObject extends PageObject<TElement>
>(
  actual: (pageObject: TPageObject) => Promise<number>,
  expected: number
): Predicate<TElement, TPageObject> {
  return async pageObject => (await actual(pageObject)) <= expected;
}
