export interface Adapter<TElement> {
  click(element: TElement): Promise<void>;

  /* tslint:disable no-any */
  evaluate<TResult>(
    script: (...args: any[]) => TResult,
    ...args: any[]
  ): Promise<TResult>;
  /* tslint:enable no-any */

  findElements(selector: string, parent?: TElement): Promise<TElement[]>;
  open(url: string): Promise<void>;
  quit(): Promise<void>;
  type(element: TElement, text: string, delay: number): Promise<void>;
}

export type Action<TComponent extends PageObject<TComponent>> = (
  component: TComponent
) => Promise<void>;

export type Predicate<TComponent extends PageObject<TComponent>> = (
  component: TComponent,
  index: number,
  components: TComponent[]
) => Promise<boolean>;

export interface Options<TComponent extends PageObject<TComponent>> {
  readonly element?: object;
  readonly parent?: PageObject<any> /* tslint:disable-line no-any */;
  readonly predicate?: Predicate<TComponent>;
}

export interface ComponentClass<TComponent extends PageObject<TComponent>> {
  readonly selector: string;

  new (adapter: Adapter<object>, options?: Options<TComponent>): TComponent;
}

export class PageObject<T extends PageObject<T>> {
  public static selectRoot<TComponent extends PageObject<TComponent>>(
    Component: ComponentClass<TComponent>,
    adapter: Adapter<object>,
    predicate?: Predicate<TComponent>
  ): TComponent {
    return new Component(adapter, {predicate});
  }

  private readonly _Component: ComponentClass<T>;
  private readonly _adapter: Adapter<object>;
  private readonly _options: Options<T>;

  public constructor(adapter: Adapter<object>, options: Options<T> = {}) {
    /* tslint:disable-next-line no-any */
    const {constructor} = this as any;

    if (typeof constructor.selector !== 'string') {
      throw new Error('Missing selector');
    }

    this._Component = constructor;
    this._adapter = adapter;
    this._options = options;
  }

  public async click(): Promise<void> {
    await this._adapter.click(await this._findElement());
  }

  public async focus(): Promise<void> {
    await this._adapter.evaluate(
      (_element: HTMLElement) => _element.focus(),
      await this._findElement()
    );
  }

  public async scrollIntoView(): Promise<void> {
    await this._adapter.evaluate(
      (_element: HTMLElement) =>
        _element.scrollIntoView({
          behavior: 'instant',
          block: 'center',
          inline: 'center'
        }),
      await this._findElement()
    );

    await new Promise<void>(resolve => setTimeout(resolve, 100));
  }

  public async type(text: string, delay: number = 100): Promise<void> {
    await this._adapter.type(await this._findElement(), text, delay);
  }

  public async getAttribute(name: string): Promise<string> {
    return this._adapter.evaluate(
      (_element: HTMLElement, _name: string) =>
        (_element.getAttribute(_name) || '').trim(),
      await this._findElement(),
      name
    );
  }

  public async getHtml(): Promise<string> {
    return this._adapter.evaluate(
      (_element: HTMLElement) => _element.innerHTML.trim(),
      await this._findElement()
    );
  }

  public async getProperty<TValue>(name: string): Promise<TValue> {
    return this._adapter.evaluate(
      (_element, _name) => _element[_name],
      await this._findElement(),
      name
    );
  }

  public async setProperty<TValue>(name: string, value: TValue): Promise<void> {
    await this._adapter.evaluate(
      (_element, _name, _value) => (_element[_name] = _value),
      await this._findElement(),
      name,
      value
    );
  }

  public async getTagName(): Promise<string> {
    return this._adapter.evaluate(
      (_element: HTMLElement) => _element.tagName.trim(),
      await this._findElement()
    );
  }

  public async getText(): Promise<string> {
    return this._adapter.evaluate(
      (_element: HTMLElement) => _element.innerText.trim(),
      await this._findElement()
    );
  }

  public async getUrl(): Promise<string> {
    return this._adapter.evaluate(() => window.location.href.trim());
  }

  /* https://stackoverflow.com/a/36737835 */
  public async isVisible(): Promise<boolean> {
    return this._adapter.evaluate((_element: HTMLElement) => {
      if (!_element.offsetHeight && !_element.offsetWidth) {
        return false;
      }

      if (getComputedStyle(_element).visibility === 'hidden') {
        return false;
      }

      return true;
    }, await this._findElement());
  }

  public async waitUntil(action: Action<T>): Promise<this> {
    const maybeTimeout = process.env.WAIT_TIMEOUT;
    const timeout = maybeTimeout ? parseInt(maybeTimeout, 10) : 10000;

    let error = new Error(`Timeout after ${timeout} milliseconds`);
    let expired = false;

    /* tslint:disable no-any */
    let timeoutId1: any;
    let timeoutId2: any;
    /* tslint:enable no-any */

    return Promise.race([
      (async () => {
        while (!expired) {
          try {
            await action(this as any) /* tslint:disable-line no-any */;

            clearTimeout(timeoutId2);

            return this;
          } catch (e) {
            error = e;
          }

          await new Promise<void>(resolve => {
            timeoutId1 = setTimeout(resolve, 40);
          });
        }

        /* istanbul ignore next */
        throw error;
      })(),
      (async () => {
        await new Promise<void>(resolve => {
          timeoutId2 = setTimeout(resolve, timeout);
        });

        expired = true;

        clearTimeout(timeoutId1);

        throw error;
      })()
    ]);
  }

  public toString(): string {
    const {parent} = this._options;
    const name = `${this.constructor.name}[${this._Component.selector}]`;

    return parent ? `${parent.toString()} > ${name}` : name;
  }

  protected selectDescendant<TComponent extends PageObject<TComponent>>(
    Component: ComponentClass<TComponent>,
    predicate?: Predicate<TComponent>
  ): TComponent {
    return new Component(this._adapter, {parent: this, predicate});
  }

  private async _findElement(): Promise<object> {
    const {element} = this._options;

    if (element) {
      return element;
    }

    const elements = await this._findElements();

    if (elements.length === 0) {
      throw new Error(`Element not found: ${this.toString()}`);
    }

    if (elements.length > 1) {
      throw new Error(`Element not unique: ${this.toString()}`);
    }

    return elements[0];
  }

  private async _findElements(): Promise<object[]> {
    const Component = this._Component;
    const adapter = this._adapter;
    const options = this._options;
    const {parent, predicate} = options;

    const elements = await adapter.findElements(
      Component.selector,
      parent && (await parent._findElement())
    );

    if (!predicate) {
      return elements;
    }

    const results = await Promise.all(
      elements
        .map(element => new Component(adapter, {...options, element}))
        .map(predicate)
    );

    return elements.filter((element, index) => results[index]);
  }
}
