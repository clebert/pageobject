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
  new (page: Page<TElement>): TPageObject;
}

/**
 * ### Import
 *
 * **ES2015 modules**
 *
 * ```js
 * import {PageObject} from '@pageobject/core';
 * ```
 *
 * **CommonJS**
 *
 * ```js
 * const {PageObject} = require('@pageobject/core');
 * ```
 */
export abstract class PageObject<TElement> {
  /**
   * The [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) describing this page object.
   */
  public abstract readonly selector: string;

  private readonly _page: Page<TElement>;

  private _element?: TElement;
  private _parent?: PageObject<TElement>;

  /* tslint:disable-next-line no-any */
  private _selectionCriterion?: Predicate<TElement, any>;

  public constructor(page: Page<TElement>) {
    this._page = page;
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
    const descendant = new Descendant(this._page);

    descendant._parent = this;

    return descendant;
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
    const copy = new Copy(this._page);

    copy._parent = this._parent;
    copy._selectionCriterion = selectionCriterion;

    return copy;
  }

  /**
   * @returns A promise that will be resolved with the number of DOM elements
   * currently assigned to this page object.
   */
  public async getSize(): Promise<number> {
    return (await this._findElements()).length;
  }

  /**
   * @returns A promise that will be resolved with the representative of the
   * unique DOM element assigned to this page object or a promise that will be
   * rejected if there is no unique DOM element assignable to this page object.
   */
  protected async getElement(): Promise<TElement> {
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
