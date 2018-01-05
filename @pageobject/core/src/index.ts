export type ElementFinder<TElement> = (
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
  new (
    finder: ElementFinder<TElement>,
    parent?: PageObject<TElement>
  ): TPageObject;
}

export interface PageObject<TElement> {
  readonly selector: string;

  select<TPageObject extends PageObject<TElement>>(
    constructor: PageObjectConstructor<TElement, TPageObject>
  ): TPageObject;

  where(condition?: Predicate<TElement, this>): this;
  findElement(): Promise<TElement>;
  getSize(): Promise<number>;
}

/**
 * `import {AbstractPageObject} from '@pageobject/class';`
 *
 * @abstract
 */
export abstract class AbstractPageObject<TElement>
  implements PageObject<TElement> {
  /**
   * @abstract
   */
  public abstract readonly selector: string;

  private readonly _finder: ElementFinder<TElement>;
  private readonly _parent?: PageObject<TElement>;

  private _condition?: Predicate<TElement, this>;
  private _element?: TElement;

  public constructor(
    finder: ElementFinder<TElement>,
    parent?: PageObject<TElement>
  ) {
    this._finder = finder;
    this._parent = parent;
  }

  public select<TPageObject extends PageObject<TElement>>(
    descendant: PageObjectConstructor<TElement, TPageObject>
  ): TPageObject {
    return new descendant(this._finder, this);
  }

  public where(condition?: Predicate<TElement, this>): this {
    const self = this.constructor as PageObjectConstructor<TElement, this>;
    const pageObject = new self(this._finder, this._parent);

    pageObject._condition = condition;

    return pageObject;
  }

  public async findElement(): Promise<TElement> {
    if (this._element) {
      return this._element;
    }

    const elements = await this._findElements();

    if (elements.length === 0) {
      throw new Error(`Element not found (${this.constructor.name})`);
    }

    if (elements.length > 1) {
      throw new Error(`Element not unique (${this.constructor.name})`);
    }

    return elements[0];
  }

  public async getSize(): Promise<number> {
    const elements = await this._findElements();

    return elements.length;
  }

  private async _findElements(): Promise<TElement[]> {
    const {_condition, _finder, _parent, selector} = this;
    const parentElement = _parent ? await _parent.findElement() : undefined;
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
