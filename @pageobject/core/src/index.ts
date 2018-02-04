export type Predicate<TElement, TPageObject extends PageObject<TElement>> = (
  pageObject: TPageObject,
  index: number,
  pageObjects: TPageObject[]
) => Promise<boolean>;

export interface Page<TElement> {
  findElements(selector: string, parent?: TElement): Promise<TElement[]>;
}

export interface PageObjectConstructor<
  TElement,
  TPageObject extends PageObject<TElement>
> {
  new (page: Page<TElement>, parent?: PageObject<TElement>): TPageObject;
}

export interface PageObject<TElement> {
  readonly selector: string;

  select<TPageObject extends PageObject<TElement>>(
    descendant: PageObjectConstructor<TElement, TPageObject>
  ): TPageObject;

  where(selectionCriterion: Predicate<TElement, this>): this;
  getElement(): Promise<TElement>;
  getSize(): Promise<number>;
}

/**
 * ### Import
 *
 * **ES2015 modules**
 *
 * ```js
 * import {AbstractPageObject} from '@pageobject/core';
 * ```
 *
 * **CommonJS**
 *
 * ```js
 * const {AbstractPageObject} = require('@pageobject/core');
 * ```
 */
export abstract class AbstractPageObject<TElement>
  implements PageObject<TElement> {
  public abstract readonly selector: string;

  private readonly _page: Page<TElement>;
  private readonly _parent?: PageObject<TElement>;

  private _selectionCriterion?: Predicate<TElement, this>;
  private _element?: TElement;

  public constructor(page: Page<TElement>, parent?: PageObject<TElement>) {
    this._page = page;
    this._parent = parent;
  }

  /**
   * You can use this method to build a tree of page objects.
   * Each page object in the tree should be assignable to a unique DOM element.
   *
   * @returns A new page object as a descendant of this page object.
   */
  public select<TPageObject extends PageObject<TElement>>(
    Descendant: PageObjectConstructor<TElement, TPageObject>
  ): TPageObject {
    return new Descendant(this._page, this);
  }

  /**
   * If the position of this page object in a tree of page objects is not
   * sufficient to assign it a unique DOM element, you can use this method to
   * define a further selection criterion.
   *
   * @returns A copy of this page object with an additional selection criterion.
   *
   * @throws An error if this page object already has a selection criterion.
   */
  public where(selectionCriterion: Predicate<TElement, this>): this {
    if (this._selectionCriterion) {
      throw new Error('A selection criterion is already defined');
    }

    const Copy = this.constructor as PageObjectConstructor<TElement, this>;
    const copy = new Copy(this._page, this._parent);

    copy._selectionCriterion = selectionCriterion;

    return copy;
  }

  /**
   * @returns A promise that will be resolved with the representative of the
   * unique DOM element assigned to this page object or a promise that will be
   * rejected if there is no unique DOM element assignable to this page object.
   */
  public async getElement(): Promise<TElement> {
    if (this._element) {
      return this._element;
    }

    const elements = await this._findElements();

    if (elements.length === 0) {
      throw new Error(`DOM element not found (${this.constructor.name})`);
    }

    if (elements.length > 1) {
      throw new Error(`DOM element not unique (${this.constructor.name})`);
    }

    return elements[0];
  }

  /**
   * @returns A promise that will be resolved with the number of DOM elements
   * currently assigned to this page object.
   */
  public async getSize(): Promise<number> {
    return (await this._findElements()).length;
  }

  private async _findElements(): Promise<TElement[]> {
    const {_page, _parent, _selectionCriterion, selector} = this;
    const parentElement = _parent ? await _parent.getElement() : undefined;
    const elements = await _page.findElements(selector, parentElement);

    if (!_selectionCriterion || elements.length === 0) {
      return elements;
    }

    const Copy = this.constructor as PageObjectConstructor<TElement, this>;

    const results = await Promise.all(
      elements
        .map(element => {
          const pageObject = new Copy(_page);

          pageObject._element = element;

          return pageObject;
        })
        .map(_selectionCriterion)
    );

    return elements.filter((element, index) => results[index]);
  }
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {and} from '@pageobject/core';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {and} = require('@pageobject/core');
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
 * import {or} from '@pageobject/core';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {or} = require('@pageobject/core');
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
 * import {not} from '@pageobject/core';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {not} = require('@pageobject/core');
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
 * import {indexEquals} from '@pageobject/core';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {indexEquals} = require('@pageobject/core');
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
 * import {indexIsGreaterThan} from '@pageobject/core';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {indexIsGreaterThan} = require('@pageobject/core');
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
 * import {indexIsGreaterThanOrEquals} from '@pageobject/core';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {indexIsGreaterThanOrEquals} = require('@pageobject/core');
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
 * import {indexIsLessThan} from '@pageobject/core';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {indexIsLessThan} = require('@pageobject/core');
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
 * import {indexIsLessThanOrEquals} from '@pageobject/core';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {indexIsLessThanOrEquals} = require('@pageobject/core');
 * ```
 */
export function indexIsLessThanOrEquals<
  TElement,
  TPageObject extends PageObject<TElement>
>(value: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index <= value;
}
