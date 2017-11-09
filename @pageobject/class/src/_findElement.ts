import {inspect} from 'util';
import {Adapter, PathSegment} from '.';
import {retryOnError} from './_retryOnError';

class ElementFinder<TElement, TAdapter extends Adapter<TElement>> {
  private readonly adapter: TAdapter;

  public constructor(adapter: TAdapter) {
    this.adapter = adapter;
  }

  public async findElement(
    path: PathSegment<TElement, TAdapter>[]
  ): Promise<TElement> {
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
    {selector, predicate}: PathSegment<TElement, TAdapter>,
    remainingPath: PathSegment<TElement, TAdapter>[]
  ): Promise<TElement[]> {
    const parent =
      remainingPath.length > 0
        ? await this.findElement(remainingPath)
        : undefined;

    const elements = await this.adapter.findElements(selector, parent);

    if (!predicate) {
      return elements;
    }

    const results = await Promise.all(
      elements.map(async (element, index) =>
        predicate(this.adapter, element, index, elements)
      )
    );

    return elements.filter((element, index) => results[index]);
  }
}

export async function findElement<TElement, TAdapter extends Adapter<TElement>>(
  path: PathSegment<TElement, TAdapter>[],
  adapter: TAdapter
): Promise<TElement> {
  const maybeTimeout = process.env.ELEMENT_SEARCH_TIMEOUT;

  return retryOnError(
    async () =>
      new ElementFinder<TElement, TAdapter>(adapter).findElement(path),
    1000 / 25 /* 40 ms */,
    maybeTimeout ? parseInt(maybeTimeout, 10) : 5000
  );
}
