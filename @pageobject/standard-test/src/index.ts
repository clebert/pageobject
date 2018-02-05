import {indexEquals} from '@pageobject/predicates';
import {
  StandardElement,
  StandardPage,
  StandardPageObject
} from '@pageobject/standard';
import * as path from 'path';

class IncompatibleElement implements StandardElement {
  public readonly click = jest.fn();
  public readonly perform = jest.fn();
  public readonly type = jest.fn();
}

class Root extends StandardPageObject {
  public readonly selector = ':root';
}

class Container extends StandardPageObject {
  public readonly selector = 'div';
}

class RadioInput extends StandardPageObject {
  public readonly selector = 'input[type="radio"]';
}

class TextInput extends StandardPageObject {
  public readonly selector = 'input[type="text"]';
}

class Unknown extends StandardPageObject {
  public readonly selector = '.unknown';
}

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {testURL} from '@pageobject/standard-test';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {testURL} = require('@pageobject/standard-test');
 * ```
 */
export const testURL = `file://${path.join(
  __dirname,
  '../fixtures/index.html'
)}`;

/**
 * **Import: ES2015 modules**
 *
 * ```js
 * import {describePageTests} from '@pageobject/standard-test';
 * ```
 *
 * **Import: CommonJS**
 *
 * ```js
 * const {describePageTests} = require('@pageobject/standard-test');
 * ```
 */
export function describePageTests(getPage: () => StandardPage): void {
  describe('StandardPage', () => {
    let page: StandardPage;
    let root: Root;
    let container: Container;
    let radioInput: RadioInput;
    let textInput: TextInput;
    let unknown: Unknown;

    beforeAll(() => {
      page = getPage();
      root = new Root(page);
      container = root.select(Container).where(indexEquals(0));
      radioInput = root.select(RadioInput);
      textInput = root.select(TextInput);
      unknown = root.select(Unknown);
    });

    describe('findElements()', () => {
      it('should throw an incompatible-parent-element error', async () => {
        await expect(
          page.findElements('selector', new IncompatibleElement())
        ).rejects.toThrow('Incompatible parent element');
      });

      it('should find elements compatible with the standard API', async () => {
        await expect(
          root.perform(
            (_element: HTMLElement, _arg1: string, _arg2: string) => [
              _element.tagName,
              _arg1,
              _arg2
            ],
            'arg1',
            'arg2'
          )
        ).resolves.toEqual(['HTML', 'arg1', 'arg2']);

        await expect(
          root.perform(() => {
            throw new Error('actionError');
          })
        ).rejects.toThrow(/actionError/);

        await expect(radioInput.getProperty('checked')).resolves.toBe('false');

        await radioInput.click();

        await expect(radioInput.getProperty('checked')).resolves.toBe('true');

        await expect(textInput.getProperty('value')).resolves.toBe('');

        await textInput.type('textValue');

        await expect(textInput.getProperty('value')).resolves.toBe('textValue');

        await expect(container.select(Container).getHTML()).resolves.toBe(
          '<div>subcontainer</div>'
        );

        await expect(unknown.getSize()).resolves.toBe(0);
      });
    });
  });
}
