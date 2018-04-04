import {Adapter, Describable, FunctionCall} from '@pageobject/base';
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

  public getPageTitle(): FunctionCall<string> {
    return new FunctionCall(this, this.getPageTitle.name, arguments, async () =>
      this._adapter.execute(() => document.title)
    );
  }

  public getPageURL(): FunctionCall<string> {
    return new FunctionCall(this, this.getPageURL.name, arguments, async () =>
      this._adapter.execute(() => window.location.href)
    );
  }

  public navigateTo(url: string): FunctionCall<void> {
    return new FunctionCall(this, this.navigateTo.name, arguments, async () =>
      this._adapter.navigateTo(url)
    );
  }

  public press(key: Key): FunctionCall<void> {
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

    return new FunctionCall(this, this.press.name, arguments, async () =>
      this._adapter.press(key)
    );
  }
}
