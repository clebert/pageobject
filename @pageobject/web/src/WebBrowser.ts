import {Adapter, Describable, Effect, serialize} from '@pageobject/base';
import {Argument, WebElement} from '.';

export type Key = 'Enter' | 'Escape' | 'Tab' | string;

export interface WebAdapter extends Adapter<WebElement> {
  execute<TResult>(
    script: (...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult>;

  navigateTo(url: string): Promise<void>;
  press(key: Key): Promise<void>;
  quit(): Promise<void>;
}

export class WebBrowser implements Describable {
  public readonly description = this.constructor.name;

  private readonly _adapter: WebAdapter;

  public constructor(adapter: WebAdapter) {
    this._adapter = adapter;
  }

  public getPageTitle(): Effect<string> {
    const trigger = async () => this._adapter.execute(() => document.title);

    return {context: this, description: 'getPageTitle()', trigger};
  }

  public getPageURL(): Effect<string> {
    const trigger = async () =>
      this._adapter.execute(() => window.location.href);

    return {context: this, description: 'getPageURL()', trigger};
  }

  public navigateTo(url: string): Effect<void> {
    const description = `navigateTo(${serialize(url)})`;
    const trigger = async () => this._adapter.navigateTo(url);

    return {context: this, description, trigger};
  }

  public press(key: Key): Effect<void> {
    if (key.length !== 1) {
      switch (key) {
        case 'Enter':
        case 'Escape':
        case 'Tab': {
          break;
        }
        default: {
          throw new Error(
            "Key must be a single character or one of: 'Enter', 'Escape', 'Tab'"
          );
        }
      }
    }

    const trigger = async () => this._adapter.press(key);

    return {context: this, description: `press(${serialize(key)})`, trigger};
  }
}
