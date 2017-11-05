import {inspect} from 'util';
import {retryOnError} from './retryOnError';

export interface Adapter<TElement> {
  findElements(selector: string, parent?: TElement): Promise<TElement[]>;
  getCurrentUrl(): Promise<string>;
}

export type Predicate<TElement> = (
  element: TElement,
  index: number,
  elements: TElement[]
) => Promise<boolean>;

export interface PathSegment<TElement> {
  readonly selector: string;
  readonly unique: boolean;
  readonly predicate?: Predicate<TElement>;
}

class ElementFinder<TElement> {
  private readonly adapter: Adapter<TElement>;

  public constructor(adapter: Adapter<TElement>) {
    this.adapter = adapter;
  }

  public async findElement(path: PathSegment<TElement>[]): Promise<TElement> {
    if (path.length === 0) {
      throw new Error('No path segments found');
    }

    const pathSegment = path[path.length - 1];
    const elements = await this.findElements(pathSegment, path.slice(0, -1));

    if (elements.length === 0) {
      throw new Error(`No elements found (path=${inspect(path)})`);
    }

    if (elements.length > 1 && pathSegment.unique) {
      throw new Error(`No unique element found (path=${inspect(path)})`);
    }

    return elements[0];
  }

  public async findElements(
    {selector, predicate}: PathSegment<TElement>,
    remainingPath: PathSegment<TElement>[]
  ): Promise<TElement[]> {
    const parent =
      remainingPath.length > 0
        ? await this.findElement(remainingPath)
        : undefined;

    const elements = await this.adapter.findElements(selector, parent);

    if (!predicate) {
      return elements;
    }

    const results = await Promise.all(elements.map(predicate));

    return elements.filter((element, index) => results[index]);
  }
}

export async function findElement<TElement>(
  path: PathSegment<TElement>[],
  adapter: Adapter<TElement>
): Promise<TElement> {
  const maybeTimeout = process.env.ELEMENT_SEARCH_TIMEOUT;

  return retryOnError(
    async () => new ElementFinder(adapter).findElement(path),
    1000 / 25 /* 40 ms */,
    maybeTimeout ? parseInt(maybeTimeout, 10) : 5000
  );
}
