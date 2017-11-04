import {inspect} from 'util';
import {Adapter, PathSegment, Predicate, findElement} from './findElement';

export interface ComponentClass<
  TElement,
  TAdapter extends Adapter<TElement>,
  TComponent extends PageObject<TElement, TAdapter>
> {
  readonly selector: string;

  new (path: PathSegment<TElement>[], adapter: TAdapter): TComponent;
}

export interface PageClass<
  TElement,
  TAdapter extends Adapter<TElement>,
  TPage extends PageObject<TElement, TAdapter>
> {
  readonly selectors: string[];
  readonly url: RegExp;

  new (path: PathSegment<TElement>[], adapter: TAdapter): TPage;
}

export class PageObject<TElement, TAdapter extends Adapter<TElement>> {
  public static async goto<
    TElement,
    TAdapter extends Adapter<TElement>,
    TPage extends PageObject<TElement, TAdapter>
  >(
    Page: PageClass<TElement, TAdapter, TPage>,
    adapter: TAdapter
  ): Promise<TPage> {
    const rootPath = [{selector: 'html', unique: true}];

    await findElement(rootPath, adapter);

    for (const selector of Page.selectors) {
      await findElement([...rootPath, {selector, unique: false}], adapter);
    }

    const url = await adapter.getCurrentUrl();

    if (!Page.url.test(url)) {
      const actual = inspect(url);
      const expected = inspect(Page.url);

      throw new Error(
        `No matching url found (actual=${actual}, expected=${expected})`
      );
    }

    return new Page(rootPath, adapter);
  }

  protected readonly adapter: TAdapter;

  private readonly path: PathSegment<TElement>[];

  public constructor(path: PathSegment<TElement>[], adapter: TAdapter) {
    this.path = path;
    this.adapter = adapter;
  }

  protected async findSelf(): Promise<TElement> {
    return findElement(this.path, this.adapter);
  }

  protected async findFirstDescendant(
    selector: string,
    predicate?: Predicate<TElement>
  ): Promise<TElement> {
    return findElement(
      [...this.path, {selector, unique: false, predicate}],
      this.adapter
    );
  }

  protected async findUniqueDescendant(
    selector: string,
    predicate?: Predicate<TElement>
  ): Promise<TElement> {
    return findElement(
      [...this.path, {selector, unique: true, predicate}],
      this.adapter
    );
  }

  protected selectFirstDescendant<
    TComponent extends PageObject<TElement, TAdapter>
  >(
    Component: ComponentClass<TElement, TAdapter, TComponent>,
    predicate?: Predicate<TElement>
  ): TComponent {
    return new Component(
      [...this.path, {selector: Component.selector, unique: false, predicate}],
      this.adapter
    );
  }

  protected selectUniqueDescendant<
    TComponent extends PageObject<TElement, TAdapter>
  >(
    Component: ComponentClass<TElement, TAdapter, TComponent>,
    predicate?: Predicate<TElement>
  ): TComponent {
    return new Component(
      [...this.path, {selector: Component.selector, unique: true, predicate}],
      this.adapter
    );
  }

  protected async goto<TPage extends PageObject<TElement, TAdapter>>(
    Page: PageClass<TElement, TAdapter, TPage>
  ): Promise<TPage> {
    return PageObject.goto(Page, this.adapter);
  }
}
