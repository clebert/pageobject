import * as assert from 'assert';
import {join} from 'path';
import {Adapter} from '.';

async function getText<TElement, TAdapter extends Adapter<TElement>>(
  adapter: TAdapter,
  element: TElement
): Promise<string> {
  return adapter.evaluate(
    (_element: HTMLElement) => _element.innerText.trim(),
    element
  );
}

export abstract class AdapterTestSuite<
  TElement,
  TAdapter extends Adapter<TElement>
> {
  public readonly initialSelectors = ['#foo', '#bar'];
  public readonly urlPattern = /index\.html/;

  public abstract async open(url: string): Promise<TAdapter>;
  public abstract async quit(adapter: TAdapter): Promise<void>;

  public async runTests(): Promise<void> {
    const adapter = await this.open(
      `file://${join(__dirname, '../fixtures/index.html')}`
    );

    try {
      const allElements = await adapter.findElements('p');

      assert.strictEqual(allElements.length, 2);

      assert.strictEqual(await getText(adapter, allElements[0]), 'Foo');
      assert.strictEqual(await getText(adapter, allElements[1]), 'Bar');

      const parentElement = (await adapter.findElements('#bar'))[0];
      const descendantElements = await adapter.findElements('p', parentElement);

      assert.strictEqual(descendantElements.length, 1);

      assert.strictEqual(await getText(adapter, descendantElements[0]), 'Bar');

      const noElements = await adapter.findElements('.unknown');

      assert.strictEqual(noElements.length, 0);
    } finally {
      await this.quit(adapter);
    }
  }
}
