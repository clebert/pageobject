import {Condition, Operator} from '@pageobject/reliable';

export interface Browser<TElement> {
  findElements(selector: string, parent?: TElement): Promise<TElement[]>;
}

export interface PageObjectClass<
  TElement,
  TBrowser extends Browser<TElement>,
  TPageObject extends PageObject<TElement, TBrowser>
> {
  new (browser: TBrowser): TPageObject;
}

export type SelectionCriterion<
  TElement,
  TBrowser extends Browser<TElement>,
  TPageObject extends PageObject<TElement, TBrowser>
> = (
  pageObject: TPageObject
) => Condition<any>; /* tslint:disable-line no-any */

export interface SearchResult<TElement> {
  readonly descriptions: string[];
  readonly elements: TElement[];
}

export abstract class PageObject<TElement, TBrowser extends Browser<TElement>> {
  public abstract readonly selector: string;

  public readonly browser: TBrowser;

  private _element?: TElement;
  private _index?: number;
  private _parent?: PageObject<TElement, TBrowser>;

  /* tslint:disable-next-line no-any */
  private _selectionCriterion?: SelectionCriterion<TElement, TBrowser, any>;

  public constructor(browser: TBrowser) {
    this.browser = browser;
  }

  public select<TPageObject extends PageObject<TElement, TBrowser>>(
    Descendant: PageObjectClass<TElement, TBrowser, TPageObject>
  ): TPageObject {
    const descendant = new Descendant(this.browser);

    descendant._parent = this;

    return descendant;
  }

  public at(index: number): this {
    if (this._index !== undefined || this._selectionCriterion) {
      throw new Error(`Selection criterion already exists: ${this.toString()}`);
    }

    const Copy = this.constructor as PageObjectClass<TElement, TBrowser, this>;
    const copy = new Copy(this.browser);

    copy._index = index;
    copy._parent = this._parent;

    return copy;
  }

  public where(
    selectionCriterion: SelectionCriterion<TElement, TBrowser, this>
  ): this {
    if (this._index !== undefined || this._selectionCriterion) {
      throw new Error(`Selection criterion already exists: ${this.toString()}`);
    }

    const Copy = this.constructor as PageObjectClass<TElement, TBrowser, this>;
    const copy = new Copy(this.browser);

    copy._parent = this._parent;
    copy._selectionCriterion = selectionCriterion;

    return copy;
  }

  public getSize(operator: Operator<number>): Condition<number> {
    return new Condition(
      operator,
      async () => (await this._findElements()).elements.length,
      'size'
    );
  }

  public async findElement(): Promise<TElement> {
    if (this._element) {
      return this._element;
    }

    const {descriptions, elements} = await this._findElements();

    if (elements.length === 0) {
      if (descriptions.length > 0) {
        throw new Error(
          `Element not matching: ${this.toString()}\n  ${descriptions
            .map(description => `• ${description}`)
            .join('\n  ')}`
        );
      }

      throw new Error(`Element not found: ${this.toString()}`);
    }

    if (elements.length > 1) {
      throw new Error(`Element not unique: ${this.toString()}`);
    }

    return elements[0];
  }

  public toString(): string {
    const {constructor, _index, _parent, _selectionCriterion} = this;
    const {name} = constructor;

    const description = _selectionCriterion
      ? `${name}${_selectionCriterion(this).describe()}`
      : _index !== undefined ? `${name}[${_index}]` : name;

    return _parent ? `${_parent.toString()} > ${description}` : description;
  }

  private async _findElements(): Promise<SearchResult<TElement>> {
    const {browser, constructor, _parent, _selectionCriterion, selector} = this;
    const parentElement = _parent ? await _parent.findElement() : undefined;
    const elements = await browser.findElements(selector, parentElement);

    if (!_selectionCriterion || elements.length === 0) {
      return {
        descriptions: [],
        elements: elements.filter(
          (element, index) => this._index === undefined || this._index === index
        )
      };
    }

    const Copy = constructor as PageObjectClass<TElement, TBrowser, this>;

    const evaluations = await Promise.all(
      elements.map(async element => {
        const pageObject = new Copy(browser);

        pageObject._element = element;

        return _selectionCriterion(pageObject).evaluate();
      })
    );

    return {
      descriptions: evaluations.map(({description}) => description),
      elements: elements.filter((element, index) => evaluations[index].result)
    };
  }
}
