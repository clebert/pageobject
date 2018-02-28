import {Condition, Operator} from '@pageobject/reliable';

export interface Adapter<TElement> {
  findElements(selector: string, parent?: TElement): Promise<TElement[]>;
}

export interface PageObjectClass<
  TElement,
  TAdapter extends Adapter<TElement>,
  TPageObject extends PageObject<TElement, TAdapter>
> {
  new (adapter: TAdapter): TPageObject;
}

export type SelectionCriterion<
  TElement,
  TAdapter extends Adapter<TElement>,
  TPageObject extends PageObject<TElement, TAdapter>
> = (
  pageObject: TPageObject
) => Condition<any>; /* tslint:disable-line no-any */

interface SearchResult<TElement> {
  readonly descriptions: string[];
  readonly elements: TElement[];
}

export abstract class PageObject<TElement, TAdapter extends Adapter<TElement>> {
  public abstract readonly selector: string;

  public readonly adapter: TAdapter;

  private _element?: TElement;
  private _parent?: PageObject<TElement, TAdapter>;
  private _position?: number;

  /* tslint:disable-next-line no-any */
  private _selectionCriterion?: SelectionCriterion<TElement, TAdapter, any>;

  public constructor(adapter: TAdapter) {
    this.adapter = adapter;
  }

  public select<TPageObject extends PageObject<TElement, TAdapter>>(
    Descendant: PageObjectClass<TElement, TAdapter, TPageObject>
  ): TPageObject {
    const descendant = new Descendant(this.adapter);

    descendant._parent = this;

    return descendant;
  }

  public nth(position: number): this {
    if (position < 1) {
      throw new Error('Position must be one-based');
    }

    if (this._position || this._selectionCriterion) {
      throw new Error(`Selection criterion already exists: ${this.toString()}`);
    }

    const Copy = this.constructor as PageObjectClass<TElement, TAdapter, this>;
    const copy = new Copy(this.adapter);

    copy._parent = this._parent;
    copy._position = position;

    return copy;
  }

  public where(
    selectionCriterion: SelectionCriterion<TElement, TAdapter, this>
  ): this {
    if (this._position || this._selectionCriterion) {
      throw new Error(`Selection criterion already exists: ${this.toString()}`);
    }

    const Copy = this.constructor as PageObjectClass<TElement, TAdapter, this>;
    const copy = new Copy(this.adapter);

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
    const {constructor, _parent, _position, _selectionCriterion} = this;
    const {name} = constructor;

    const description = _selectionCriterion
      ? `${name}${_selectionCriterion(this).describe()}`
      : _position ? `${name}[${_position}]` : name;

    return _parent ? `${_parent.toString()} > ${description}` : description;
  }

  private async _findElements(): Promise<SearchResult<TElement>> {
    const {adapter, constructor, _parent, _selectionCriterion, selector} = this;
    const parentElement = _parent ? await _parent.findElement() : undefined;
    const elements = await adapter.findElements(selector, parentElement);

    if (!_selectionCriterion || elements.length === 0) {
      return {
        descriptions: [],
        elements: elements.filter(
          (element, index) => !this._position || this._position === index + 1
        )
      };
    }

    const Copy = constructor as PageObjectClass<TElement, TAdapter, this>;

    const evaluations = await Promise.all(
      elements.map(async element => {
        const pageObject = new Copy(adapter);

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
