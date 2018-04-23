import {Adapter, Component, Effect} from '@pageobject/base';

export type Argument = any; // tslint:disable-line no-any

export interface WebNode {
  click(): Promise<void>;
  doubleClick(): Promise<void>;

  execute<THTMLElement extends HTMLElement, TResult>(
    script: (element: THTMLElement, ...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult>;
}

export type Character = string;
export type Key = 'Enter' | 'Escape' | 'Tab';

export interface WebAdapter extends Adapter<WebNode> {
  execute<TResult>(
    script: (...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult>;

  goto(url: string): Promise<void>;
  press(key: Key | Character): Promise<void>;
  quit(): Promise<void>;
}

export class Keyboard {
  public readonly adapter: WebAdapter;

  public constructor(adapter: WebAdapter) {
    this.adapter = adapter;
  }

  public press(key: Key): Effect<void> {
    return async () => this.adapter.press(key);
  }

  public type(text: string): Effect<void> {
    return async () => {
      for (const character of text.split('')) {
        await this.adapter.press(character);
      }
    };
  }
}

export class Page {
  public readonly adapter: WebAdapter;

  public constructor(adapter: WebAdapter) {
    this.adapter = adapter;
  }

  public getTitle(): Effect<string> {
    return async () => this.adapter.execute(() => document.title);
  }

  public getURL(): Effect<string> {
    return async () => this.adapter.execute(() => window.location.href);
  }

  public goto(url: string): Effect<void> {
    return async () => this.adapter.goto(url);
  }
}

export abstract class WebComponent extends Component<WebNode, WebAdapter> {
  public readonly keyboard: Keyboard;
  public readonly page: Page;

  public constructor(adapter: WebAdapter, ancestor?: WebComponent) {
    super(adapter, ancestor);

    this.keyboard = new Keyboard(adapter);
    this.page = new Page(adapter);
  }

  public click(): Effect<void> {
    return async () => (await this.findUniqueNode()).click();
  }

  public doubleClick(): Effect<void> {
    return async () => (await this.findUniqueNode()).doubleClick();
  }

  public getNodeCount(): Effect<number> {
    return async () => (await this.findNodes()).length;
  }

  /**
   * @returns The "rendered" text content of this component and its descendants.
   */
  public getText(): Effect<string> {
    return async () =>
      (await this.findUniqueNode()).execute(element =>
        element.innerText.trim()
      );
  }

  public hasFocus(): Effect<boolean> {
    return async () =>
      (await this.findUniqueNode()).execute(
        element => document.activeElement === element
      );
  }

  public isExisting(): Effect<boolean> {
    return async () => (await this.findNodes()).length > 0;
  }

  public isUnique(): Effect<boolean> {
    return async () => (await this.findNodes()).length === 1;
  }

  /**
   * A component is considered visible if it consumes space in the document.
   */
  public isVisible(): Effect<boolean> {
    return async () =>
      (await this.findUniqueNode()).execute(element => {
        const {offsetHeight, offsetWidth} = element;

        return Boolean(offsetHeight && offsetWidth);
      });
  }

  public scrollIntoView(): Effect<void> {
    return async () =>
      (await this.findUniqueNode()).execute(element => {
        const {height, left, top, width} = element.getBoundingClientRect();
        const {innerHeight, innerWidth} = window;

        window.scrollBy(
          left - innerWidth / 2 + width / 2,
          top - innerHeight / 2 + height / 2
        );
      });
  }
}
