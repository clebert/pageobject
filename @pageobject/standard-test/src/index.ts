import {indexEquals} from '@pageobject/core';
import {
  StandardElement,
  StandardFinder,
  StandardPageObject
} from '@pageobject/standard';
import * as path from 'path';

class IncompatibleElement implements StandardElement {
  public readonly click = jest.fn();
  public readonly perform = jest.fn();
  public readonly type = jest.fn();
  public readonly isVisible = jest.fn();
}

class Root extends StandardPageObject {
  public readonly selector = ':root';
}

class Container extends StandardPageObject {
  public readonly selector = 'div';
}

class Paragraph extends StandardPageObject {
  public readonly selector = 'p';
}

class RadioInput extends StandardPageObject {
  public readonly selector = 'input[type="radio"]';
}

class TextInput extends StandardPageObject {
  public readonly selector = 'input[type="text"]';
}

/**
 * `import {url} from '@pageobject/standard-test';`
 */
export const url = `file://${path.join(__dirname, '../fixtures/index.html')}`;

/**
 * `import {describeTests} from '@pageobject/standard-test';`
 */
export function describeTests(createFinder: () => StandardFinder): void {
  describe('finder()', () => {
    let finder: StandardFinder;
    let root: Root;
    let visibleContainer: Container;
    let hiddenContainer: Container;
    let radioInput: RadioInput;
    let textInput: TextInput;

    beforeAll(() => {
      finder = createFinder();
      root = new Root(finder);
      visibleContainer = root.select(Container).where(indexEquals(0));
      hiddenContainer = root.select(Container).where(indexEquals(1));
      radioInput = root.select(RadioInput);
      textInput = root.select(TextInput);
    });

    it('should throw an incompatible-parent-element error', async () => {
      await expect(
        finder('selector', new IncompatibleElement())
      ).rejects.toThrow('Incompatible parent element');
    });

    it('should find an element that implements the standard API', async () => {
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
          throw new Error('Element error');
        })
      ).rejects.toThrow(/Element error/);

      await expect(
        radioInput.perform((_element: HTMLInputElement) => _element.checked)
      ).resolves.toBe(false);

      await radioInput.click();

      await expect(
        radioInput.perform((_element: HTMLInputElement) => _element.checked)
      ).resolves.toBe(true);

      await expect(
        textInput.perform((_element: HTMLInputElement) => _element.value)
      ).resolves.toBe('');

      await textInput.type('Text');

      await expect(
        textInput.perform((_element: HTMLInputElement) => _element.value)
      ).resolves.toBe('Text');

      await expect(visibleContainer.isVisible()).resolves.toBe(true);

      await expect(
        visibleContainer.select(Paragraph).isVisible()
      ).resolves.toBe(true);

      await expect(hiddenContainer.isVisible()).resolves.toBe(false);

      await expect(hiddenContainer.select(Paragraph).isVisible()).resolves.toBe(
        false
      );
    });
  });
}
