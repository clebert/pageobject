import {fail, ok, strictEqual} from 'assert';
import {join} from 'path';
import {FlexibleAdapter, FlexibleKey} from '.';

const url = `file://${join(__dirname, '../fixtures/index.html')}`;

export class FlexibleAdapterTestSuite {
  public readonly adapter: FlexibleAdapter;

  public constructor(adapter: FlexibleAdapter) {
    this.adapter = adapter;
  }

  public async testAll(): Promise<void> {
    await this.testFindElements();
    await this.testElementClick();
    await this.testElementDoubleClick();
    await this.testElementExecute();
    await this.testElementSendCharacter();
    await this.testElementSendKey();
  }

  public async testFindElements(): Promise<void> {
    await this.adapter.navigateTo(url);

    const divs = await this.adapter.findElements('div');

    strictEqual(divs.length, 2);

    strictEqual((await this.adapter.findElements('div', divs[0])).length, 1);
    strictEqual((await this.adapter.findElements('div', divs[1])).length, 0);

    strictEqual((await this.adapter.findElements('unknown')).length, 0);

    try {
      /* tslint:disable-next-line no-any */
      await this.adapter.findElements('div', {} as any);

      fail('Missing incompatible-parent-element error');
    } catch (error) {
      strictEqual(error.message, 'Incompatible parent element');
    }
  }

  public async testElementClick(): Promise<void> {
    await this.adapter.navigateTo(url);

    const button = (await this.adapter.findElements('.click'))[0];

    strictEqual(await button.execute(() => document.title), 'Test');

    await button.click();

    strictEqual(await button.execute(() => document.title), 'Event: click');
  }

  public async testElementDoubleClick(): Promise<void> {
    await this.adapter.navigateTo(url);

    const button = (await this.adapter.findElements('.dblclick'))[0];

    strictEqual(await button.execute(() => document.title), 'Test');

    await button.doubleClick();

    strictEqual(await button.execute(() => document.title), 'Event: dblclick');
  }

  public async testElementExecute(): Promise<void> {
    await this.adapter.navigateTo(url);

    const root = (await this.adapter.findElements(':root'))[0];

    strictEqual(
      await root.execute(
        (_root, ..._args) => [_root.tagName, ..._args].join(','),
        'arg1',
        'arg2'
      ),
      'HTML,arg1,arg2'
    );

    try {
      await root.execute(() => {
        throw new Error('Script error');
      });

      fail('Missing script error');
    } catch (error) {
      ok(/Script error/.test(error.message));
    }
  }

  public async testElementSendCharacter(): Promise<void> {
    await this.adapter.navigateTo(url);

    const textInput = (await this.adapter.findElements('input'))[0];

    strictEqual(
      await textInput.execute(
        (_textInput: HTMLInputElement) => _textInput.value
      ),
      ''
    );

    await textInput.sendCharacter('H');
    await textInput.sendCharacter('e');
    await textInput.sendCharacter('l');
    await textInput.sendCharacter('l');
    await textInput.sendCharacter('o');
    await textInput.sendCharacter(',');
    await textInput.sendCharacter(' ');
    await textInput.sendCharacter('W');
    await textInput.sendCharacter('o');
    await textInput.sendCharacter('r');
    await textInput.sendCharacter('l');
    await textInput.sendCharacter('d');
    await textInput.sendCharacter('!');

    try {
      await textInput.sendCharacter('');

      fail('Missing invalid-character error');
    } catch (error) {
      strictEqual(error.message, 'Invalid character');
    }

    try {
      await textInput.sendCharacter('!!');

      fail('Missing invalid-character error');
    } catch (error) {
      strictEqual(error.message, 'Invalid character');
    }

    strictEqual(
      await textInput.execute(
        (_textInput: HTMLInputElement) => _textInput.value
      ),
      'Hello, World!'
    );
  }

  public async testElementSendKey(): Promise<void> {
    await this.adapter.navigateTo(url);

    const textInput = (await this.adapter.findElements('input'))[0];

    strictEqual(await textInput.execute(() => document.title), 'Test');

    await textInput.sendKey(FlexibleKey.ENTER);

    strictEqual(
      await textInput.execute(() => document.title),
      `Event: keyup (${FlexibleKey.ENTER})`
    );

    await textInput.sendKey(FlexibleKey.ESCAPE);

    strictEqual(
      await textInput.execute(() => document.title),
      `Event: keyup (${FlexibleKey.ESCAPE})`
    );

    await textInput.sendKey(FlexibleKey.TAB);

    strictEqual(
      await textInput.execute(() => document.title),
      `Event: keyup (${FlexibleKey.TAB})`
    );
  }
}
