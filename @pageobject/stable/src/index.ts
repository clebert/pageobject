import {Condition, Operator} from '@pageobject/reliable';

export interface Page<TElement> {
  findElements(selector: string, parent?: TElement): Promise<TElement[]>;
}

export interface PageObjectConstructor<
  TElement,
  TPageObject extends PageObject<TElement>
> {
  new (page: Page<TElement>): TPageObject;
}

export type SelectionCriterion<
  TElement,
  TPageObject extends PageObject<TElement>
> = (
  pageObject: TPageObject,
  index: (operator: Operator<number>) => Condition<number>
) => Condition<any>; /* tslint:disable-line no-any */

export abstract class PageObject<TElement> {
  public abstract readonly selector: string;

  public readonly page: Page<TElement>;

  private _element?: TElement;
  private _parent?: PageObject<TElement>;

  /* tslint:disable-next-line no-any */
  private _selectionCriterion?: SelectionCriterion<TElement, any>;

  public constructor(page: Page<TElement>) {
    this.page = page;
  }

  public select<TPageObject extends PageObject<TElement>>(
    Descendant: PageObjectConstructor<TElement, TPageObject>
  ): TPageObject {
    const descendant = new Descendant(this.page);

    descendant._parent = this;

    return descendant;
  }

  public where(selectionCriterion: SelectionCriterion<TElement, this>): this {
    if (this._selectionCriterion) {
      throw new Error('A selection criterion is already defined');
    }

    const Copy = this.constructor as PageObjectConstructor<TElement, this>;
    const copy = new Copy(this.page);

    copy._parent = this._parent;
    copy._selectionCriterion = selectionCriterion;

    return copy;
  }

  public getSize(operator: Operator<number>): Condition<number> {
    return new Condition(
      operator,
      async () => (await this._findElements()).length,
      'size'
    );
  }

  public isUnique(operator: Operator<boolean>): Condition<boolean> {
    return new Condition(
      operator,
      async () => (await this._findElements()).length === 1,
      'unique'
    );
  }

  public async findElement(): Promise<TElement> {
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
    const {page, _parent, _selectionCriterion, selector} = this;
    const parentElement = _parent ? await _parent.findElement() : undefined;
    const elements = await page.findElements(selector, parentElement);

    if (!_selectionCriterion || elements.length === 0) {
      return elements;
    }

    const Copy = this.constructor as PageObjectConstructor<TElement, this>;

    const evaluations = await Promise.all(
      elements
        .map(element => {
          const pageObject = new Copy(page);

          pageObject._element = element;

          return pageObject;
        })
        .map(async (pageObject, index) =>
          _selectionCriterion(
            pageObject,
            (operator: Operator<number>) =>
              new Condition(operator, async () => index, 'index')
          ).evaluate()
        )
    );

    return elements.filter((element, index) => evaluations[index].result);
  }
}
