import {indexEquals} from '@pageobject/predicates';
import {
  StandardElement,
  StandardKey,
  StandardPage,
  StandardPageObject
} from '@pageobject/standard';
import * as path from 'path';

class IncompatibleElement implements StandardElement {
  public readonly click = jest.fn();
  public readonly doubleClick = jest.fn();
  public readonly perform = jest.fn();
  public readonly sendCharacter = jest.fn();
  public readonly sendKey = jest.fn();
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

      it('should only find elements compatible with the standard API', async () => {
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

        await radioInput.doubleClick();

        await expect(root.getPageTitle()).resolves.toBe('dblclick');

        await expect(textInput.getProperty('value')).resolves.toBe('');

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

        await expect(textInput.getProperty('value')).resolves.toBe(
          'Hello, World!'
        );

        await expect(textInput.sendCharacter('')).rejects.toThrow(
          'Invalid character'
        );

        await expect(textInput.sendCharacter('text')).rejects.toThrow(
          'Invalid character'
        );

        await textInput.sendKey(StandardKey.ENTER);

        await expect(root.getPageTitle()).resolves.toBe('keyup: ENTER');

        await textInput.sendKey(StandardKey.ESCAPE);

        await expect(root.getPageTitle()).resolves.toBe('keyup: ESCAPE');

        await textInput.sendKey(StandardKey.TAB);

        await expect(root.getPageTitle()).resolves.toBe('keyup: TAB');

        await expect(container.select(Container).getHTML()).resolves.toBe(
          '<div>subcontainer</div>'
        );

        await expect(unknown.getSize()).resolves.toBe(0);
      });
    });
  });
}
