import {ok, strictEqual} from 'assert';
import {join} from 'path';
import {WebAdapter} from '.';

const url = `file://${join(__dirname, '../fixtures/index.html')}`;

export class WebAdapterTest {
  private readonly _adapter: WebAdapter;

  public constructor(adapter: WebAdapter) {
    this._adapter = adapter;
  }

  public async run(): Promise<void> {
    try {
      await this._testAdapterExecute();
      await this._testAdapterFindElements();
      await this._testAdapterNavigateTo();
      await this._testAdapterPress();

      await this._testElementClick();
      await this._testElementDoubleClick();
      await this._testElementExecute();
    } finally {
      await this._adapter.quit();
    }
  }

  private async _getPageTitle(): Promise<string> {
    // istanbul ignore next
    return this._adapter.execute(() => document.title);
  }

  private async _testAdapterExecute(): Promise<void> {
    await this._adapter.navigateTo(url);

    // istanbul ignore next
    strictEqual(
      await this._adapter.execute(
        (...args) => [document.title, ...args].join(','),
        'arg1',
        'arg2'
      ),
      'Test,arg1,arg2'
    );

    let scriptError = new Error();

    try {
      // istanbul ignore next
      await this._adapter.execute(() => {
        throw new Error('execute');
      });
    } catch (error) {
      scriptError = error;
    }

    ok(/execute/.test(scriptError.message));
  }

  private async _testAdapterFindElements(): Promise<void> {
    await this._adapter.navigateTo(url);

    const divs = await this._adapter.findElements('div');

    strictEqual(divs.length, 2);

    strictEqual((await this._adapter.findElements('div', divs[0])).length, 1);
    strictEqual((await this._adapter.findElements('div', divs[1])).length, 0);

    strictEqual((await this._adapter.findElements('unknown')).length, 0);
  }

  private async _testAdapterNavigateTo(): Promise<void> {
    await this._adapter.navigateTo(url);

    strictEqual(await this._getPageTitle(), 'Test');

    await this._adapter.navigateTo('http://example.com');

    strictEqual(await this._getPageTitle(), 'Example Domain');
  }

  private async _testAdapterPress(): Promise<void> {
    await this._adapter.navigateTo(url);

    strictEqual(await this._getPageTitle(), 'Test');

    await this._adapter.press('a');

    strictEqual(
      await this._getPageTitle(),
      'Event: keydown a, keypress a, keyup a'
    );

    await this._adapter.press('Enter');

    strictEqual(
      await this._getPageTitle(),
      'Event: keydown Enter, keypress Enter, keyup Enter'
    );

    await this._adapter.press('Escape');

    strictEqual(
      await this._getPageTitle(),
      'Event: keydown Escape, keyup Escape'
    );

    await this._adapter.press('Tab');

    strictEqual(await this._getPageTitle(), 'Event: keydown Tab, keyup Tab');
  }

  private async _testElementClick(): Promise<void> {
    await this._adapter.navigateTo(url);

    const button = (await this._adapter.findElements('#click'))[0];

    strictEqual(await this._getPageTitle(), 'Test');

    await button.click();

    strictEqual(await this._getPageTitle(), 'Event: click');
  }

  private async _testElementDoubleClick(): Promise<void> {
    await this._adapter.navigateTo(url);

    const button = (await this._adapter.findElements('#dblclick'))[0];

    strictEqual(await this._getPageTitle(), 'Test');

    await button.doubleClick();

    strictEqual(await this._getPageTitle(), 'Event: dblclick');
  }

  private async _testElementExecute(): Promise<void> {
    await this._adapter.navigateTo(url);

    const root = (await this._adapter.findElements('#text'))[0];

    // istanbul ignore next
    strictEqual(
      await root.execute(
        (element, ...args) =>
          [document.title, element.innerText, ...args].join(','),
        'arg1',
        'arg2'
      ),
      'Test,text,arg1,arg2'
    );

    let scriptError = new Error();

    try {
      // istanbul ignore next
      await this._adapter.execute(() => {
        throw new Error('execute');
      });
    } catch (error) {
      scriptError = error;
    }

    ok(/execute/.test(scriptError.message));
  }
}
