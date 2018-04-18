import {Predicate} from '.';

export interface Adapter<TNode> {
  findNodes(selector: string, ancestor?: TNode): Promise<TNode[]>;
}

export interface ComponentClass<TNode, TComponent extends Component<TNode>> {
  readonly selector: string;

  new (adapter: Adapter<TNode>, ancestor?: Component<TNode>): TComponent;
}

export type Effect<TResult> = () => Promise<TResult>;

export type Getter<TNode, TComponent extends Component<TNode>, TResult> = (
  component: TComponent
) => Effect<TResult>;

export abstract class Component<TNode> {
  public static readonly selector: string | undefined;

  public readonly adapter: Adapter<TNode>;
  public readonly ancestor?: Component<TNode>;

  private _filter?: (component: Component<TNode>) => Promise<boolean>;
  private _position?: number;
  private _node?: TNode;

  public constructor(adapter: Adapter<TNode>, ancestor?: Component<TNode>) {
    this.adapter = adapter;
    this.ancestor = ancestor;
  }

  public select<TComponent extends Component<TNode>>(
    Descendant: ComponentClass<TNode, TComponent>
  ): TComponent {
    return new Descendant(this.adapter, this);
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

    const reconstruction = this._reconstruct();

    reconstruction._filter = this._filter;
    reconstruction._position = position;

    return reconstruction;
  }

  public where<TValue>(
    getter: Getter<TNode, this, TValue>,
    predicate: Predicate<TValue>
  ): this {
    const reconstruction = this._reconstruct();

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

    const {selector} = this.constructor as typeof Component;

    if (!selector) {
      throw new Error(
        `The specified ${this.toString()} component has no selector`
      );
    }

    let nodes = await this.adapter.findNodes(
      selector,
      this.ancestor && (await this.ancestor.findUniqueNode())
    );

    const filter = this._filter;

    if (filter) {
      const results = await Promise.all(
        nodes.map(async node => {
          const reconstruction = this._reconstruct();

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

  private _reconstruct(): this {
    return new (this.constructor as ComponentClass<TNode, this>)(
      this.adapter,
      this.ancestor
    );
  }
}
