export type Finder<TElement> = (
  selector: string,
  parent?: TElement
) => Promise<TElement[]>;

export type Predicate<TElement, TPageObject extends PageObject<TElement>> = (
  pageObject: TPageObject,
  index: number,
  pageObjects: TPageObject[]
) => Promise<boolean>;

export interface PageObjectConstructor<
  TElement,
  TPageObject extends PageObject<TElement>
> {
  new (finder: Finder<TElement>, parent?: PageObject<TElement>): TPageObject;
}

export interface PageObject<TElement> {
  readonly selector: string;

  select<TPageObject extends PageObject<TElement>>(
    descendant: PageObjectConstructor<TElement, TPageObject>
  ): TPageObject;

  where(condition: Predicate<TElement, this>): this;
  getElement(): Promise<TElement>;
  getSize(): Promise<number>;
}

/**
 * `import {AbstractPageObject} from '@pageobject/core';`
 *
 * @abstract
 */
export abstract class AbstractPageObject<TElement>
  implements PageObject<TElement> {
  /**
   * @abstract
   */
  public abstract readonly selector: string;

  private readonly _finder: Finder<TElement>;
  private readonly _parent?: PageObject<TElement>;

  private _condition?: Predicate<TElement, this>;
  private _element?: TElement;

  public constructor(finder: Finder<TElement>, parent?: PageObject<TElement>) {
    this._finder = finder;
    this._parent = parent;
  }

  /**
   * You can use this method to build a tree of page objects.
   * Each page object in the tree should be assignable to a unique DOM element.
   *
   * @returns A new page object as a descendant of this page object.
   */
  public select<TPageObject extends PageObject<TElement>>(
    descendant: PageObjectConstructor<TElement, TPageObject>
  ): TPageObject {
    return new descendant(this._finder, this);
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
  public where(condition: Predicate<TElement, this>): this {
    if (this._condition) {
      throw new Error('A selection criterion is already defined');
    }

    const self = this.constructor as PageObjectConstructor<TElement, this>;
    const pageObject = new self(this._finder, this._parent);

    pageObject._condition = condition;

    return pageObject;
  }

  /**
   * @returns A promise that will be resolved with the representative of the
   * unique DOM element assigned to this page object or a promise that will be
   * rejected if the DOM element assigned to this page object cannot be
   * found or is not unique.
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
    const {_condition, _finder, _parent, selector} = this;
    const parentElement = _parent ? await _parent.getElement() : undefined;
    const elements = await _finder(selector, parentElement);

    if (!_condition || elements.length === 0) {
      return elements;
    }

    const self = this.constructor as PageObjectConstructor<TElement, this>;

    const results = await Promise.all(
      elements
        .map(element => {
          const pageObject = new self(_finder);

          pageObject._element = element;

          return pageObject;
        })
        .map(_condition)
    );

    return elements.filter((element, index) => results[index]);
  }
}

/**
 * `import {and} from '@pageobject/core';`
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
 * `import {or} from '@pageobject/core';`
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
 * `import {not} from '@pageobject/core';`
 */
export function not<TElement, TPageObject extends PageObject<TElement>>(
  predicate: Predicate<TElement, TPageObject>
): Predicate<TElement, TPageObject> {
  return async (pageObject, index, pageObjects) =>
    !await predicate(pageObject, index, pageObjects);
}

/**
 * `import {indexEquals} from '@pageobject/core';`
 */
export function indexEquals<TElement, TPageObject extends PageObject<TElement>>(
  value: number
): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index === value;
}

/**
 * `import {indexIsGreaterThan} from '@pageobject/core';`
 */
export function indexIsGreaterThan<
  TElement,
  TPageObject extends PageObject<TElement>
>(value: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index > value;
}

/**
 * `import {indexIsGreaterThanOrEquals} from '@pageobject/core';`
 */
export function indexIsGreaterThanOrEquals<
  TElement,
  TPageObject extends PageObject<TElement>
>(value: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index >= value;
}

/**
 * `import {indexIsLessThan} from '@pageobject/core';`
 */
export function indexIsLessThan<
  TElement,
  TPageObject extends PageObject<TElement>
>(value: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index < value;
}

/**
 * `import {indexIsLessThanOrEquals} from '@pageobject/core';`
 */
export function indexIsLessThanOrEquals<
  TElement,
  TPageObject extends PageObject<TElement>
>(value: number): Predicate<TElement, TPageObject> {
  return async (pageObject, index) => index <= value;
}
