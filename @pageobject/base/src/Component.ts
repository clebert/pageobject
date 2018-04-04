import {Describable, Effect, Operator} from '.';

export interface Adapter<TElement> {
  findElements(selector: string, parent?: TElement): Promise<TElement[]>;
}

export type Accessor<
  TElement,
  TComponent extends Component<TElement>,
  TValue
> = (pageObject: TComponent) => Effect<TValue>;

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
  create(
    adapter: Adapter<TElement>,
    locator?: Locator<TElement, TComponent>
  ): TComponent;
}

export class Component<TElement> implements Describable {
  public readonly description: string;

  private readonly _adapter: Adapter<TElement>;
  private readonly _locator: Locator<TElement, this>;
  private readonly _ownFactory: ComponentFactory<TElement, this>;
  private readonly _selector: string;

  protected constructor(
    adapter: Adapter<TElement>,
    locator: Locator<TElement, any> = {}, // tslint:disable-line no-any
    ownFactory: ComponentFactory<TElement, any>, // tslint:disable-line no-any
    selector: string
  ) {
    this._adapter = adapter;
    this._locator = locator;
    this._ownFactory = ownFactory;
    this._selector = selector;

    this.description = this._describe();
  }

  public select<TDescendant extends Component<TElement>>(
    descendantFactory: ComponentFactory<TElement, TDescendant>
  ): TDescendant {
    return descendantFactory.create(this._adapter, {parent: this});
  }

  public nth(position: number): this {
    if (position < 1) {
      throw new Error('Position must be one-based');
    }

    if (this._locator.position) {
      throw new Error('Position is already set');
    }

    return this._ownFactory.create(this._adapter, {...this._locator, position});
  }

  public where<TValue>(
    accessor: Accessor<TElement, this, TValue>,
    operator: Operator<TValue>
  ): this {
    const {filters} = this._locator;

    return this._ownFactory.create(this._adapter, {
      ...this._locator,
      filters: [...(filters || []), {accessor, operator}]
    });
  }

  public getElementCount(): Effect<number> {
    const trigger = async () => (await this.findElements()).length;

    return {context: this, description: 'getElementCount()', trigger};
  }

  protected async findElement(): Promise<TElement> {
    const elements = await this.findElements();

    if (elements.length === 0) {
      throw new Error('Element not found');
    }

    if (elements.length > 1) {
      throw new Error('Element not unique');
    }

    return elements[0];
  }

  protected async findElements(): Promise<TElement[]> {
    const elements = await this._filterElements();
    const {position} = this._locator;

    if (position) {
      const index = position - 1;

      return index < elements.length ? [elements[index]] : [];
    }

    return elements;
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
      this._selector,
      parent ? await parent.findElement() : undefined
    );

    if (!filters) {
      return elements;
    }

    const results = await Promise.all(
      elements.map(async element => {
        const instance = this._ownFactory.create({
          findElements: async () => [element]
        });

        return (await Promise.all(
          filters.map(async filter =>
            filter.operator.test(await filter.accessor(instance).trigger())
          )
        )).every(result => result);
      })
    );

    return elements.filter((element, index) => results[index]);
  }
}
