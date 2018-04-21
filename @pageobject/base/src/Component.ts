import {Predicate} from '.';

export interface Adapter<TNode> {
  findNodes(selector: string, ancestor?: TNode): Promise<TNode[]>;
}

export type Effect<TResult> = () => Promise<TResult>;

export abstract class Component<TNode, TAdapter extends Adapter<TNode>> {
  public abstract readonly selector: string;

  public readonly adapter: TAdapter;
  public readonly ancestor?: Component<TNode, TAdapter>;

  private _filter?: (component: Component<TNode, TAdapter>) => Promise<boolean>;
  private _position?: number;
  private _node?: TNode;

  public constructor(adapter: TAdapter, ancestor?: Component<TNode, TAdapter>) {
    this.adapter = adapter;
    this.ancestor = ancestor;
  }

  public at(position: number): this {
    if (position < 1) {
      throw new Error(`The specified position (${position}) must be one-based`);
    }

    if (this._position) {
      throw new Error(
        `The existing position (${
          this._position
        }) of this ${this.toString()} component cannot be overwritten with ${position}`
      );
    }

    const reconstruction = this.reconstruct();

    reconstruction._filter = this._filter;
    reconstruction._position = position;

    return reconstruction;
  }

  public where<TValue>(
    getter: (component: this) => Effect<TValue>,
    predicate: Predicate<TValue>
  ): this {
    const reconstruction = this.reconstruct();

    reconstruction._filter = async component =>
      (this._filter ? await this._filter(component) : true) &&
      predicate.test(await getter(component as this)());

    reconstruction._position = this._position;

    return reconstruction;
  }

  public async findNodes(): Promise<TNode[]> {
    if (this._node) {
      return [this._node];
    }

    if (!this.selector) {
      throw new Error(
        `The specified ${this.toString()} component has no selector`
      );
    }

    let nodes = await this.adapter.findNodes(
      this.selector,
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

    if (this._position) {
      const index = this._position - 1;

      nodes = index < nodes.length ? [nodes[index]] : [];
    }

    return nodes;
  }

  public async findUniqueNode(): Promise<TNode> {
    const nodes = await this.findNodes();

    if (nodes.length === 0) {
      throw new Error(
        `The searched ${this.toString()} component cannot be found`
      );
    }

    if (nodes.length > 1) {
      throw new Error(
        `The searched ${this.toString()} component cannot be uniquely determined`
      );
    }

    return nodes[0];
  }

  public getNodeCount(): Effect<number> {
    return async () => (await this.findNodes()).length;
  }

  public toString(): string {
    return `<${this.constructor.name}>`;
  }

  protected reconstruct(): this {
    // tslint:disable-next-line no-any
    return new (this.constructor as any)(this.adapter, this.ancestor);
  }
}
