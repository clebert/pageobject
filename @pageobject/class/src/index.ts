import {AdapterMock} from './AdapterMock';
import {AdapterTestSuite} from './AdapterTestSuite';
import {PageObject} from './PageObject';

export {AdapterMock, AdapterTestSuite, PageObject};

export interface Adapter<TElement> {
  /* tslint:disable no-any */
  evaluate<TResult>(
    script: (...args: any[]) => TResult,
    ...args: any[]
  ): Promise<TResult>;
  /* tslint:enable no-any */

  findElements(selector: string, parent?: TElement): Promise<TElement[]>;
}

export interface ComponentClass<
  TElement,
  TAdapter extends Adapter<TElement>,
  TComponent extends PageObject<TElement, TAdapter>
> {
  readonly selector: string;

  new (path: PathSegment<TElement, TAdapter>[], adapter: TAdapter): TComponent;
}

export interface PageClass<
  TElement,
  TAdapter extends Adapter<TElement>,
  TPage extends PageObject<TElement, TAdapter>
> {
  readonly selectors: string[];
  readonly url: RegExp;

  new (path: PathSegment<TElement, TAdapter>[], adapter: TAdapter): TPage;
}

export type Predicate<TElement, TAdapter extends Adapter<TElement>> = (
  adapter: TAdapter,
  element: TElement,
  index: number,
  elements: TElement[]
) => Promise<boolean>;

export interface PathSegment<TElement, TAdapter extends Adapter<TElement>> {
  readonly selector: string;
  readonly unique: boolean;
  readonly predicate?: Predicate<TElement, TAdapter>;
}
