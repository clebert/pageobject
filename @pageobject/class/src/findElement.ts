import {inspect} from 'util';

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

async function findElements<TElement>(
  {selector, predicate}: PathSegment<TElement>,
  remainingPath: PathSegment<TElement>[],
  adapter: Adapter<TElement>
): Promise<TElement[]> {
  const elementsPromise =
    remainingPath.length > 0
      ? adapter.findElements(
          selector,
          await findElement(remainingPath, adapter)
        )
      : adapter.findElements(selector);

  const elements = await elementsPromise;

  if (!predicate) {
    return elements;
  }

  const results = await Promise.all(elements.map(predicate));

  return elements.filter((element, index) => results[index]);
}

export async function findElement<TElement>(
  path: PathSegment<TElement>[],
  adapter: Adapter<TElement>
): Promise<TElement> {
  if (path.length === 0) {
    throw new Error('No path segments found');
  }

  const pathSegment = path[path.length - 1];
  const elements = await findElements(pathSegment, path.slice(0, -1), adapter);

  if (elements.length === 0) {
    throw new Error(`No elements found (path=${inspect(path)})`);
  }

  if (elements.length > 1 && pathSegment.unique) {
    throw new Error(`No unique element found (path=${inspect(path)})`);
  }

  return elements[0];
}
