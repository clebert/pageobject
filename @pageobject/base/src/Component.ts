import {Describable, FunctionCall, Operator} from '.';

export interface Adapter<TElement> {
  findElements(selector: string, parent?: TElement): Promise<TElement[]>;
}

export type Accessor<
  TElement,
  TComponent extends Component<TElement>,
  TResult
> = (pageObject: TComponent) => FunctionCall<TResult>;

export interface Filter<
  TElement,
  TComponent extends Component<TElement>,
  TValue
> {
  readonly accessor: Accessor<TElement, TComponent, TValue>;
  readonly operator: Operator<TValue>;
}

export interface Locator<TElement, TComponent extends Component<TElement>> {
  readonly filters?: Filter<TElement, TComponent, any>[]; // tslint:disable-line no-any
  readonly parent?: Component<TElement>;
  readonly position?: number;
}

export interface ComponentFactory<
  TElement,
  TComponent extends Component<TElement>
> {
  new (
    adapter: Adapter<TElement>,
    locator?: Locator<TElement, TComponent>
  ): TComponent;
}

export abstract class Component<TElement> implements Describable {
  public abstract readonly selector: string;

  public readonly description: string;

  private readonly _adapter: Adapter<TElement>;
  private readonly _locator: Locator<TElement, this>;

  public constructor(
    adapter: Adapter<TElement>,
    locator: Locator<TElement, any> = {} // tslint:disable-line no-any
  ) {
    this._adapter = adapter;
    this._locator = locator;

    this.description = this._describe();
  }

  public select<TDescendant extends Component<TElement>>(
    Descendant: ComponentFactory<TElement, TDescendant>
  ): TDescendant {
    return new Descendant(this._adapter, {parent: this});
  }

  public nth(position: number): this {
    if (position < 1) {
      throw new Error('Position must be one-based');
    }

    if (this._locator.position) {
      throw new Error('Position is already set');
    }

    const Self = this.constructor as ComponentFactory<TElement, this>;

    return new Self(this._adapter, {...this._locator, position});
  }

  public where<TValue>(
    accessor: Accessor<TElement, this, TValue>,
    operator: Operator<TValue>
  ): this {
    const Self = this.constructor as ComponentFactory<TElement, this>;

    return new Self(this._adapter, {
      ...this._locator,
      filters: [...(this._locator.filters || []), {accessor, operator}]
    });
  }

  public getElementCount(): FunctionCall<number> {
    return new FunctionCall(
      this,
      this.getElementCount.name,
      arguments,
      async () => (await this._findElements()).length
    );
  }

  protected async findElement(): Promise<TElement> {
    const elements = await this._findElements();

    if (elements.length === 0) {
      throw new Error('Element not found');
    }

    if (elements.length > 1) {
      throw new Error('Element not unique');
    }

    return elements[0];
  }

  private _describe(): string {
    const {filters, parent, position} = this._locator;

    const selectDescription = parent
      ? `${parent.description}.select(${this.constructor.name})`
      : `${this.constructor.name}`;

    const nthDescription = position ? `.nth(${position})` : '';

    const whereDescription = filters
      ? `.where(${filters
          .map(filter =>
            filter.operator.describe(filter.accessor(this).description)
          )
          .join(', ')})`
      : '';

    return `${selectDescription}${nthDescription}${whereDescription}`;
  }

  private async _filterElements(): Promise<TElement[]> {
    const {filters, parent} = this._locator;

    const elements = await this._adapter.findElements(
      this.selector,
      parent ? await parent.findElement() : undefined
    );

    if (!filters) {
      return elements;
    }

    const results = await Promise.all(
      elements.map(async element => {
        const Self = this.constructor as ComponentFactory<TElement, this>;

        const instance = new Self({
          findElements: async () => [element]
        });

        return (await Promise.all(
          filters.map(async filter =>
            filter.operator.test(await filter.accessor(instance).effect())
          )
        )).every(result => result);
      })
    );

    return elements.filter((element, index) => results[index]);
  }

  private async _findElements(): Promise<TElement[]> {
    const elements = await this._filterElements();
    const {position} = this._locator;

    if (position) {
      const index = position - 1;

      return index < elements.length ? [elements[index]] : [];
    }

    return elements;
  }
}
