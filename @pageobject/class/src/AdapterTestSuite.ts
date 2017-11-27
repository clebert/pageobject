import * as assert from 'assert';
import {join} from 'path';
import {Adapter} from './PageObject';

/* tslint:disable no-any */
async function getProperty<TElement, TAdapter extends Adapter<TElement>>(
  adapter: TAdapter,
  element: TElement,
  name: string
): Promise<any> {
  return adapter.evaluate((_element, _name) => _element[_name], element, name);
}
/* tslint:enable no-any */

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
  public abstract createAdapter(): Promise<TAdapter>;

  public async runTests(): Promise<void> {
    const adapter = await this.createAdapter();

    await adapter.open(`file://${join(__dirname, '../fixtures/index.html')}`);

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

      const radioElement = (await adapter.findElements(
        'input[type="radio"]'
      ))[0];

      assert.ok(!await getProperty(adapter, radioElement, 'checked'));

      await adapter.click(radioElement);

      assert.ok(await getProperty(adapter, radioElement, 'checked'));
    } finally {
      await adapter.quit();
    }
  }
}
