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

  private readonly _finder: Finder<TElement>;
  private readonly _parent?: PageObject<TElement>;

  private _condition?: Predicate<TElement, this>;
  private _element?: TElement;

  public constructor(finder: Finder<TElement>, parent?: PageObject<TElement>) {
    this._finder = finder;
    this._parent = parent;
  }

  public select<TPageObject extends PageObject<TElement>>(
    descendant: PageObjectConstructor<TElement, TPageObject>
  ): TPageObject {
    return new descendant(this._finder, this);
  }

  public where(condition: Predicate<TElement, this>): this {
    const self = this.constructor as PageObjectConstructor<TElement, this>;
    const pageObject = new self(this._finder, this._parent);

    pageObject._condition = condition;

    return pageObject;
  }

  public async getElement(): Promise<TElement> {
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

export async function perform<TResult>(
  action: () => Promise<TResult>,
  explicitTimeout: number | string | undefined = process.env.IMPLICIT_TIMEOUT
): Promise<TResult> {
  if (explicitTimeout === undefined) {
    throw new Error('Please specify an explicit or implicit timeout value');
  }

  const timeout = parseInt(String(explicitTimeout), 10);

  if (!Number.isFinite(timeout)) {
    throw new Error('Invalid timeout value');
  }

  let error = new Error(`Timeout after ${timeout} milliseconds`);
  let resolved = false;

  let timeoutID: any; /* tslint:disable-line no-any */

  return Promise.race([
    (async () => {
      while (!resolved) {
        try {
          const result = await action();

          clearTimeout(timeoutID);

          return result;
        } catch (e) {
          error = e;
        }

        await new Promise<void>(setImmediate);
      }

      /* istanbul ignore next */
      throw error;
    })(),
    (async () => {
      await new Promise<void>(resolve => {
        timeoutID = setTimeout(resolve, timeout);
      });

      resolved = true;

      throw error;
    })()
  ]);
}
