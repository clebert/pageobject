import {Predicate} from '.';

export type Accessor<TNode, TComponent extends Component<TNode>, TValue> = (
  component: TComponent
) => () => Promise<TValue>;

export interface Adapter<TNode> {
  findNodes(selector: string, ancestor?: TNode): Promise<TNode[]>;
}

export class Component<TNode> {
  public static readonly selector: string | undefined;

  protected readonly adapter: Adapter<TNode>;
  protected readonly ancestor?: Component<TNode>;

  private _filter?: (component: Component<TNode>) => Promise<boolean>;
  private _position?: number;
  private _node?: TNode;

  public constructor(adapter: Adapter<TNode>, ancestor?: Component<TNode>) {
    this.adapter = adapter;
    this.ancestor = ancestor;
  }

  public at(position: number): this {
    if (position < 1) {
      throw new Error('Position must be one-based');
    }

    if (this._position) {
      throw new Error('Position is already set');
    }

    const reconstruction = this.reconstruct();

    reconstruction._filter = this._filter;
    reconstruction._position = position;

    return reconstruction;
  }

  public where<TValue>(
    accessor: Accessor<TNode, this, TValue>,
    predicate: Predicate<TValue>
  ): this {
    const reconstruction = this.reconstruct();

    reconstruction._filter = async component =>
      (this._filter ? await this._filter(component) : true) &&
      predicate(await accessor(component as this)());

    reconstruction._position = this._position;

    return reconstruction;
  }

  public async findNodes(): Promise<TNode[]> {
    if (this._node) {
      return [this._node];
    }

    const {selector} = this.constructor as typeof Component;

    if (!selector) {
      throw new Error('Undefined selector');
    }

    let nodes = await this.adapter.findNodes(
      selector,
      this.ancestor && (await this.ancestor.findUniqueNode())
    );

    const filter = this._filter;

    if (filter) {
      const results = await Promise.all(
        nodes.map(async node => {
          const reconstruction = this.reconstruct();

          reconstruction._node = node;

          return filter(reconstruction);
        })
      );

      nodes = nodes.filter((node, index) => results[index]);
    }

    const position = this._position;

    if (position) {
      const index = position - 1;

      nodes = index < nodes.length ? [nodes[index]] : [];
    }

    return nodes;
  }

  public async findUniqueNode(): Promise<TNode> {
    const nodes = await this.findNodes();

    if (nodes.length === 0) {
      throw new Error(`Node not found: ${this.constructor.name}`);
    }

    if (nodes.length > 1) {
      throw new Error(`Node not unique: ${this.constructor.name}`);
    }

    return nodes[0];
  }

  public getNodeCount(): () => Promise<number> {
    return async () => (await this.findNodes()).length;
  }

  protected reconstruct(): this {
    return new (this.constructor as typeof Component)(
      this.adapter,
      this.ancestor
    ) as this;
  }
}
