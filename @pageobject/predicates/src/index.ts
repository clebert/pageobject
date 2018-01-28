import {PageObject, Predicate} from '@pageobject/core';

/**
 * `import {indexIsEqualTo} from '@pageobject/predicates';`
 */
export function indexIsEqualTo<
  TElement,
  TPageObject extends PageObject<TElement>
>(n: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index === n;
}

/**
 * `import {indexIsGreaterThan} from '@pageobject/predicates';`
 */
export function indexIsGreaterThan<
  TElement,
  TPageObject extends PageObject<TElement>
>(n: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index > n;
}

/**
 * `import {indexIsGreaterThanOrEqualTo} from '@pageobject/predicates';`
 */
export function indexIsGreaterThanOrEqualTo<
  TElement,
  TPageObject extends PageObject<TElement>
>(n: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index >= n;
}

/**
 * `import {indexIsLessThan} from '@pageobject/predicates';`
 */
export function indexIsLessThan<
  TElement,
  TPageObject extends PageObject<TElement>
>(n: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index < n;
}

/**
 * `import {indexIsLessThanOrEqualTo} from '@pageobject/predicates';`
 */
export function indexIsLessThanOrEqualTo<
  TElement,
  TPageObject extends PageObject<TElement>
>(n: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index <= n;
}
