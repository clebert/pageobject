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
