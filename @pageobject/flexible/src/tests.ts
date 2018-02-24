import {TestCase, equals} from '@pageobject/reliable';
import {join} from 'path';
import {
  FlexibleElement,
  FlexibleKey,
  FlexiblePage,
  FlexiblePageObject
} from '.';

class ElementMock implements FlexibleElement {
  public readonly click = jest.fn();
  public readonly doubleClick = jest.fn();
  public readonly execute = jest.fn();
  public readonly sendCharacter = jest.fn();
  public readonly sendKey = jest.fn();
}

class TestButton extends FlexiblePageObject {
  public readonly selector = 'button';
}

class TestRoot extends FlexiblePageObject {
  public readonly selector = ':root';
}

class TestTextInput extends FlexiblePageObject {
  public readonly selector = 'input[type="text"]';
}

export const testURL = `file://${join(__dirname, '../fixtures/index.html')}`;

export function describeTests(getPage: () => FlexiblePage): void {
  let testCase: TestCase;

  beforeEach(() => {
    testCase = new TestCase(1000);
  });

  describe('FlexiblePage', () => {
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
          getPage().findElements('selector', new ElementMock())
        ).rejects.toThrow('Incompatible parent element');
      });
    });
  });

  describe('FlexibleElement', () => {
    describe('click()', () => {
      it('should send a click event to a DOM element', async () => {
        const button = new TestButton(getPage()).where((_, index) =>
          index(equals(0))
        );

        await testCase
          .assert(button.getPageTitle(equals('Test')))
          .perform(button.click())
          .assert(button.getPageTitle(equals('Event: click')))
          .run();
      });
    });

    describe('doubleClick()', () => {
      it('should send a dblclick event to a DOM element', async () => {
        const button = new TestButton(getPage()).where((_, index) =>
          index(equals(1))
        );

        await testCase
          .assert(button.getPageTitle(equals('Test')))
          .perform(button.doubleClick())
          .assert(button.getPageTitle(equals('Event: dblclick')))
          .run();
      });
    });

    describe('execute()', () => {
      it('should execute a script', async () => {
        const root = new TestRoot(getPage());

        await expect(
          (await root.findElement()).execute(
            (_element, ..._args) => [_element.tagName, ..._args],
            'arg1',
            'arg2'
          )
        ).resolves.toEqual(['HTML', 'arg1', 'arg2']);
      });

      it('should throw a script error', async () => {
        const root = new TestRoot(getPage());

        await expect(
          (await root.findElement()).execute(() => {
            throw new Error('scriptError');
          })
        ).rejects.toThrow(/scriptError/);
      });
    });

    describe('sendCharacter()', () => {
      it('should send a character to a DOM element', async () => {
        const textInput = new TestTextInput(getPage());

        await testCase
          .assert(textInput.getProperty('value', equals('')))
          .perform(textInput.type('Hello, World!'))
          .assert(textInput.getProperty('value', equals('Hello, World!')))
          .run();
      });

      it('should throw an invalid-character error', async () => {
        const textInput = new TestTextInput(getPage());

        await expect(
          (await textInput.findElement()).sendCharacter('')
        ).rejects.toThrow('Invalid character');

        await expect(
          (await textInput.findElement()).sendCharacter('!!')
        ).rejects.toThrow('Invalid character');
      });
    });

    describe('sendKey()', () => {
      it('should send the ENTER key to a DOM element', async () => {
        const textInput = new TestTextInput(getPage());

        await testCase
          .assert(textInput.getPageTitle(equals('Test')))
          .perform(textInput.sendKey(FlexibleKey.ENTER))
          .assert(
            textInput.getPageTitle(
              equals(`Event: keyup (${FlexibleKey.ENTER})`)
            )
          )
          .run();
      });

      it('should send the ESCAPE key to a DOM element', async () => {
        const textInput = new TestTextInput(getPage());

        await testCase
          .assert(textInput.getPageTitle(equals('Test')))
          .perform(textInput.sendKey(FlexibleKey.ESCAPE))
          .assert(
            textInput.getPageTitle(
              equals(`Event: keyup (${FlexibleKey.ESCAPE})`)
            )
          )
          .run();
      });

      it('should send the TAB key to a DOM element', async () => {
        const textInput = new TestTextInput(getPage());

        await testCase
          .assert(textInput.getPageTitle(equals('Test')))
          .perform(textInput.sendKey(FlexibleKey.TAB))
          .assert(
            textInput.getPageTitle(equals(`Event: keyup (${FlexibleKey.TAB})`))
          )
          .run();
      });
    });
  });
}
