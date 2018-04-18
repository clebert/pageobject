import {Adapter, Effect} from '@pageobject/base';
import {Argument, WebNode} from '.';

export type Key = 'Enter' | 'Escape' | 'Tab' | string;

export interface WebAdapter extends Adapter<WebNode> {
  execute<TResult>(
    script: (...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult>;

  navigateTo(url: string): Promise<void>;
  press(key: Key): Promise<void>;
  quit(): Promise<void>;
}

export class WebBrowser {
  public readonly adapter: WebAdapter;

  public constructor(adapter: WebAdapter) {
    this.adapter = adapter;
  }

  public getPageTitle(): Effect<string> {
    return async () => this.adapter.execute(() => document.title);
  }

  public getPageURL(): Effect<string> {
    return async () => this.adapter.execute(() => window.location.href);
  }

  public navigateTo(url: string): Effect<void> {
    return async () => this.adapter.navigateTo(url);
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

    return async () => this.adapter.press(key);
  }
}
