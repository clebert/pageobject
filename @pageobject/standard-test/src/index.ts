import {
  StandardElement,
  StandardFinder,
  StandardPageObject
} from '@pageobject/standard';
import * as path from 'path';

class IncompatibleElement implements StandardElement {
  public async click(): Promise<void> {
    return;
  }

  public async type(text: string): Promise<void> {
    return;
  }

  public async getAttribute(name: string): Promise<string | undefined> {
    return undefined;
  }

  public async getHTML(): Promise<string> {
    return '';
  }

  public async getProperty<TValue>(name: string): Promise<TValue | undefined> {
    return undefined;
  }

  public async getTagName(): Promise<string> {
    return '';
  }

  public async getText(): Promise<string> {
    return '';
  }

  public async isVisible(): Promise<boolean> {
    return false;
  }
}

class Container extends StandardPageObject {
  public readonly selector = 'div';

  public selectChild(): Container {
    return this.select(Container);
  }
}

class RadioInput extends StandardPageObject {
  public readonly selector = 'input[type="radio"]';
}

class TextInput extends StandardPageObject {
  public readonly selector = 'input[type="text"]';
}

export const url = `file://${path.join(__dirname, '../fixtures/index.html')}`;

export function describeTests(createFinder: () => StandardFinder): void {
  describe('finder()', () => {
    let finder: StandardFinder;
    let visibleContainer: Container;
    let hiddenContainer: Container;
    let radioInput: RadioInput;
    let textInput: TextInput;

    beforeAll(() => {
      finder = createFinder();

      visibleContainer = new Container(finder).where(
        async (_, index) => index === 0
      );

      hiddenContainer = new Container(finder).where(
        async (_, index) => index === 2
      );

      radioInput = new RadioInput(finder);
      textInput = new TextInput(finder);
    });

    it('should throw an incompatible-parent-element error', async () => {
      await expect(
        finder('selector', new IncompatibleElement())
      ).rejects.toEqual(new Error('Incompatible parent element'));
    });

    it('should find an element that implements click()', async () => {
      await radioInput.click();
    });

    it('should find an element that implements type()', async () => {
      await textInput.type('Text');
    });

    it('should find an element that implements getAttribute()', async () => {
      await expect(visibleContainer.getAttribute('unknown')).resolves.toBe(
        undefined
      );

      await expect(hiddenContainer.getAttribute('style')).resolves.toBe(
        'display: none;'
      );
    });

    it('should find an element that implements getHTML()', async () => {
      await expect(visibleContainer.selectChild().getHTML()).resolves.toBe(
        '<div> Visible </div>'
      );

      await expect(hiddenContainer.selectChild().getHTML()).resolves.toBe(
        '<div> Hidden </div>'
      );
    });

    it('should find an element that implements getProperty()', async () => {
      await expect(radioInput.getProperty('checked')).resolves.toBe(true);
      await expect(textInput.getProperty('value')).resolves.toBe('Text');
    });

    it('should find an element that implements getTagName()', async () => {
      await expect(visibleContainer.getTagName()).resolves.toBe('div');

      await expect(visibleContainer.selectChild().getTagName()).resolves.toBe(
        'div'
      );

      await expect(hiddenContainer.getTagName()).resolves.toBe('div');

      await expect(hiddenContainer.selectChild().getTagName()).resolves.toBe(
        'div'
      );

      await expect(radioInput.getTagName()).resolves.toBe('input');
      await expect(textInput.getTagName()).resolves.toBe('input');
    });

    it('should find an element that implements getText()', async () => {
      await expect(visibleContainer.selectChild().getText()).resolves.toBe(
        'Visible'
      );

      await expect(hiddenContainer.selectChild().getText()).resolves.toBe('');
    });

    it('should find an element that implements isVisible()', async () => {
      await expect(visibleContainer.isVisible()).resolves.toBe(true);

      await expect(visibleContainer.selectChild().isVisible()).resolves.toBe(
        true
      );

      await expect(hiddenContainer.isVisible()).resolves.toBe(false);

      await expect(hiddenContainer.selectChild().isVisible()).resolves.toBe(
        false
      );
    });
  });
}
