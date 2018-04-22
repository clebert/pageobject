import {Adapter} from '@pageobject/base';
import {ok, strictEqual} from 'assert';
import {join} from 'path';
import {WebAdapter} from '.';

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

const fileURL = `file://${join(__dirname, '../fixtures/index.html')}`;

export class WebAdapterTest {
  public readonly adapter: WebAdapter;

  public constructor(adapter: WebAdapter) {
    this.adapter = adapter;
  }

  public async run(): Promise<void> {
    try {
      await this._testAdapterExecute();
      await this._testAdapterFindNodes();
      await this._testAdapterGoto();
      await this._testAdapterPress();

      await this._testNodeClick();
      await this._testNodeDoubleClick();
      await this._testNodeExecute();
    } finally {
      await this.adapter.quit();
    }
  }

  private async _getPageTitle(): Promise<string> {
    // istanbul ignore next
    return this.adapter.execute(() => document.title);
  }

  private async _testAdapterExecute(): Promise<void> {
    await this.adapter.goto(fileURL);

    // istanbul ignore next
    strictEqual(
      await this.adapter.execute(
        (...args) => [document.title, ...args].join(','),
        'arg1',
        'arg2'
      ),
      'Test,arg1,arg2'
    );

    let message = '';

    try {
      // istanbul ignore next
      await this.adapter.execute(() => {
        throw new Error('script');
      });
    } catch (error) {
      message = error.message;
    }

    ok(/script/.test(message));
  }

  private async _testAdapterFindNodes(): Promise<void> {
    await this.adapter.goto(fileURL);

    const divs = await this.adapter.findNodes('div');

    strictEqual(divs.length, 2);

    strictEqual((await this.adapter.findNodes('div', divs[0])).length, 1);
    strictEqual((await this.adapter.findNodes('div', divs[1])).length, 0);

    strictEqual((await this.adapter.findNodes('unknown')).length, 0);
  }

  private async _testAdapterGoto(): Promise<void> {
    await this.adapter.goto(fileURL);

    strictEqual(await this._getPageTitle(), 'Test');

    await this.adapter.goto('http://example.com');

    strictEqual(await this._getPageTitle(), 'Example Domain');
  }

  private async _testAdapterPress(): Promise<void> {
    await this.adapter.goto(fileURL);

    strictEqual(await this._getPageTitle(), 'Test');

    await this.adapter.press('a');

    strictEqual(
      await this._getPageTitle(),
      'Event: keydown a, keypress a, keyup a'
    );

    await this.adapter.press('Enter');

    strictEqual(
      await this._getPageTitle(),
      'Event: keydown Enter, keypress Enter, keyup Enter'
    );

    await this.adapter.press('Escape');

    strictEqual(
      await this._getPageTitle(),
      'Event: keydown Escape, keyup Escape'
    );

    await this.adapter.press('Tab');

    strictEqual(await this._getPageTitle(), 'Event: keydown Tab, keyup Tab');
  }

  private async _testNodeClick(): Promise<void> {
    await this.adapter.goto(fileURL);

    const button = (await this.adapter.findNodes('#click'))[0];

    strictEqual(await this._getPageTitle(), 'Test');

    await button.click();

    strictEqual(await this._getPageTitle(), 'Event: click');
  }

  private async _testNodeDoubleClick(): Promise<void> {
    await this.adapter.goto(fileURL);

    const button = (await this.adapter.findNodes('#dblclick'))[0];

    strictEqual(await this._getPageTitle(), 'Test');

    await button.doubleClick();

    strictEqual(await this._getPageTitle(), 'Event: dblclick');
  }

  private async _testNodeExecute(): Promise<void> {
    await this.adapter.goto(fileURL);

    const text = (await this.adapter.findNodes('#text'))[0];

    // istanbul ignore next
    strictEqual(
      await text.execute(
        (element, ...args) =>
          [document.title, element.innerText, ...args].join(','),
        'arg1',
        'arg2'
      ),
      'Test,text,arg1,arg2'
    );

    let message = '';

    try {
      // istanbul ignore next
      await this.adapter.execute(() => {
        throw new Error('script');
      });
    } catch (error) {
      message = error.message;
    }

    ok(/script/.test(message));
  }
}
