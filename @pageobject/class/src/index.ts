import * as selenium from 'selenium-webdriver';

export type Action<TComponent extends PageObject<TComponent>> = (
  component: TComponent
) => Promise<void>;

export type Predicate<TComponent extends PageObject<TComponent>> = (
  component: TComponent,
  index: number,
  components: TComponent[]
) => Promise<boolean>;

export interface Options<TComponent extends PageObject<TComponent>> {
  readonly element?: selenium.WebElement;
  readonly parent?: PageObject<any> /* tslint:disable-line no-any */;
  readonly predicate?: Predicate<TComponent>;
}

export interface ComponentClass<TComponent extends PageObject<TComponent>> {
  readonly selector: string;

  new (driver: selenium.WebDriver, options?: Options<TComponent>): TComponent;
}

export type LimitedWebElement = Pick<
  selenium.WebElement,
  | 'click'
  | 'sendKeys'
  | 'getTagName'
  | 'getCssValue'
  | 'getAttribute'
  | 'getText'
  | 'getSize'
  | 'getLocation'
  | 'isEnabled'
  | 'isSelected'
  | 'submit'
  | 'clear'
  | 'isDisplayed'
  | 'takeScreenshot'
>;

export class PageObject<T extends PageObject<T>> {
  public static selectRoot<TComponent extends PageObject<TComponent>>(
    Component: ComponentClass<TComponent>,
    driver: selenium.WebDriver,
    predicate?: Predicate<TComponent>
  ): TComponent {
    return new Component(driver, {predicate});
  }

  private readonly _Component: ComponentClass<T>;
  private readonly _driver: selenium.WebDriver;
  private readonly _options: Options<T>;

  public constructor(driver: selenium.WebDriver, options: Options<T> = {}) {
    /* tslint:disable-next-line no-any */
    const {constructor} = this as any;

    if (typeof constructor.selector !== 'string') {
      throw new Error('Missing selector');
    }

    this._Component = constructor;
    this._driver = driver;
    this._options = options;
  }

  public get element(): LimitedWebElement {
    /* tslint:disable no-any */
    return new Proxy<LimitedWebElement>({} as any, {
      get: (target, name) => async (...args: any[]) => {
        const element = await this._findElement();

        return element[name as keyof LimitedWebElement].apply(element, [
          ...args
        ]);
      }
    });
    /* tslint:enable no-any */
  }

  public async getNumberOfDescendants<
    TComponent extends PageObject<TComponent>
  >(
    Component: ComponentClass<TComponent>,
    predicate?: Predicate<TComponent>
  ): Promise<number> {
    const descendant = this.selectDescendant(Component, predicate);
    const elements = await descendant._findElements();

    return elements.length;
  }

  public selectDescendant<TComponent extends PageObject<TComponent>>(
    Component: ComponentClass<TComponent>,
    predicate?: Predicate<TComponent>
  ): TComponent {
    return new Component(this._driver, {parent: this, predicate});
  }

  public async waitUntil(
    action: Action<T>,
    callback: (errorScreenshot: string) => Promise<void>
  ): Promise<this> {
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

        await callback(await this._driver.takeScreenshot());

        /* istanbul ignore next */
        throw error;
      })(),
      (async () => {
        await new Promise<void>(resolve => {
          timeoutId2 = setTimeout(resolve, timeout);
        });

        expired = true;

        clearTimeout(timeoutId1);

        await callback(await this._driver.takeScreenshot());

        throw error;
      })()
    ]);
  }

  public toString(): string {
    const {parent} = this._options;
    const name = `${this.constructor.name}[${this._Component.selector}]`;

    return parent ? `${parent.toString()} > ${name}` : name;
  }

  private async _findElement(): Promise<selenium.WebElement> {
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

  private async _findElements(): Promise<selenium.WebElement[]> {
    const Component = this._Component;
    const driver = this._driver;
    const options = this._options;
    const {parent, predicate} = options;
    const parentElement = parent && (await parent._findElement());

    const elements = await (parentElement || driver).findElements(
      selenium.By.css(Component.selector)
    );

    if (!predicate) {
      return elements;
    }

    const results = await Promise.all(
      elements
        .map(element => new Component(driver, {...options, element}))
        .map(predicate)
    );

    return elements.filter((element, index) => results[index]);
  }
}
