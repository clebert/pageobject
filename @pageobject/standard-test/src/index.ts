import {indexEquals} from '@pageobject/predicates';
import {
  StandardElement,
  StandardKey,
  StandardPage,
  StandardPageObject
} from '@pageobject/standard';
import {join} from 'path';

class IncompatibleElement implements StandardElement {
  public readonly click = jest.fn();
  public readonly doubleClick = jest.fn();
  public readonly perform = jest.fn();
  public readonly sendCharacter = jest.fn();
  public readonly sendKey = jest.fn();
}

class Button extends StandardPageObject {
  public readonly selector = 'button';
}

class Root extends StandardPageObject {
  public readonly selector = ':root';
}

class TextInput extends StandardPageObject {
  public readonly selector = 'input[type="text"]';
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
export const testURL = `file://${join(__dirname, '../fixtures/index.html')}`;

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
    describe('findElements()', () => {
      it('should use the specified parent element as the root node', async () => {
        const elements = await getPage().findElements('div');

        expect(elements).toHaveLength(2);

        await expect(
          getPage().findElements('div', elements[0])
        ).resolves.toHaveLength(1);

        await expect(
          getPage().findElements('div', elements[1])
        ).resolves.toHaveLength(0);
      });

      it('should handle a non-matching selector', async () => {
        await expect(getPage().findElements('selector')).resolves.toEqual([]);
      });

      it('should throw an incompatible-parent-element error', async () => {
        await expect(
          getPage().findElements('selector', new IncompatibleElement())
        ).rejects.toThrow('Incompatible parent element');
      });
    });
  });

  describe('StandardElement', () => {
    describe('click()', () => {
      it('should send a click event to a DOM element', async () => {
        const button = new Button(getPage()).where(indexEquals(0));

        await expect(button.getPageTitle()).resolves.toBe('Test');

        await button.click();

        await expect(button.getPageTitle()).resolves.toBe('Event: click');
      });
    });

    describe('doubleClick()', () => {
      it('should send a dblclick event to a DOM element', async () => {
        const button = new Button(getPage()).where(indexEquals(1));

        await expect(button.getPageTitle()).resolves.toBe('Test');

        await button.doubleClick();

        await expect(button.getPageTitle()).resolves.toBe('Event: dblclick');
      });
    });

    describe('perform()', () => {
      it('should perform an action on a DOM element', async () => {
        const root = new Root(getPage());

        await expect(
          root.perform(
            (_element, ..._args) => [_element.tagName, ..._args],
            'arg1',
            'arg2'
          )
        ).resolves.toEqual(['HTML', 'arg1', 'arg2']);
      });

      it('should throw an action error', async () => {
        const root = new Root(getPage());

        await expect(
          root.perform(() => {
            throw new Error('actionError');
          })
        ).rejects.toThrow(/actionError/);
      });
    });

    describe('sendCharacter()', () => {
      it('should send a character to a DOM element', async () => {
        const textInput = new TextInput(getPage());

        await expect(textInput.getProperty('value')).resolves.toBe('');

        const expected = 'Hello, World!';

        for (const character of expected.split('')) {
          await textInput.sendCharacter(character);
        }

        await expect(textInput.getProperty('value')).resolves.toBe(expected);
      });

      it('should throw an invalid-character error', async () => {
        const textInput = new TextInput(getPage());

        await expect(textInput.sendCharacter('')).rejects.toThrow(
          'Invalid character'
        );

        await expect(textInput.sendCharacter('!!')).rejects.toThrow(
          'Invalid character'
        );
      });
    });

    describe('sendKey()', () => {
      it('should send the ENTER key to a DOM element', async () => {
        const textInput = new TextInput(getPage());

        await expect(textInput.getPageTitle()).resolves.toBe('Test');

        await textInput.sendKey(StandardKey.ENTER);

        await expect(textInput.getPageTitle()).resolves.toBe(
          `Event: keyup (${StandardKey.ENTER})`
        );
      });

      it('should send the ESCAPE key to a DOM element', async () => {
        const textInput = new TextInput(getPage());

        await expect(textInput.getPageTitle()).resolves.toBe('Test');

        await textInput.sendKey(StandardKey.ESCAPE);

        await expect(textInput.getPageTitle()).resolves.toBe(
          `Event: keyup (${StandardKey.ESCAPE})`
        );
      });

      it('should send the TAB key to a DOM element', async () => {
        const textInput = new TextInput(getPage());

        await expect(textInput.getPageTitle()).resolves.toBe('Test');

        await textInput.sendKey(StandardKey.TAB);

        await expect(textInput.getPageTitle()).resolves.toBe(
          `Event: keyup (${StandardKey.TAB})`
        );
      });
    });
  });
}
