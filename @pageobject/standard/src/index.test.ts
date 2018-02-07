import {StandardKey, StandardPageObject} from '.';

interface MockDOMElement {
  any: any /* tslint:disable-line no-any */;
  innerText: string;
  outerHTML: string;

  readonly getAttribute: jest.Mock;
  readonly blur: jest.Mock;
  readonly focus: jest.Mock;
  readonly scrollIntoView: jest.Mock;
}

interface MockElement {
  readonly click: jest.Mock;
  readonly doubleClick: jest.Mock;
  readonly perform: jest.Mock;
  readonly sendCharacter: jest.Mock;
  readonly sendKey: jest.Mock;
}

class MockPageObject extends StandardPageObject {
  public readonly selector = 'mock';
}

async function nap(): Promise<void> {
  for (let i = 0; i < 10; i += 1) {
    await Promise.resolve();
  }
}

describe('StandardPageObject', () => {
  let findElements: jest.Mock;
  let getComputedStyle: jest.SpyInstance;
  let domElement: MockDOMElement;
  let element: MockElement;
  let pageObject: MockPageObject;

  beforeEach(() => {
    getComputedStyle = jest.spyOn(window, 'getComputedStyle');

    domElement = {
      any: ' anyValue ',
      innerText: ' innerTextValue ',
      outerHTML: ' outerHTMLValue ',
      getAttribute: jest.fn(),
      blur: jest.fn(),
      focus: jest.fn(),
      scrollIntoView: jest.fn()
    };

    element = {
      click: jest.fn(),
      doubleClick: jest.fn(),
      perform: jest.fn(),
      sendCharacter: jest.fn(),
      sendKey: jest.fn()
    };

    element.perform.mockImplementation(async (action, ...args) =>
      action(domElement, ...args)
    );

    findElements = jest.fn().mockImplementation(async () => [element]);

    pageObject = new MockPageObject({findElements});
  });

  afterEach(() => {
    getComputedStyle.mockRestore();
  });

  describe('click()', () => {
    it('should click on the DOM element', async () => {
      element.click.mockImplementation(async () => {
        throw new Error('clickError');
      });

      await expect(pageObject.click()).rejects.toThrow('clickError');

      expect(element.click).toHaveBeenCalledTimes(1);
      expect(element.click).toHaveBeenLastCalledWith();
    });
  });

  describe('doubleClick()', () => {
    it('should double-click on the DOM element', async () => {
      element.doubleClick.mockImplementation(async () => {
        throw new Error('doubleClickError');
      });

      await expect(pageObject.doubleClick()).rejects.toThrow(
        'doubleClickError'
      );

      expect(element.doubleClick).toHaveBeenCalledTimes(1);
      expect(element.doubleClick).toHaveBeenLastCalledWith();
    });
  });

  describe('perform()', () => {
    it('should perform an action on the DOM element', async () => {
      const action = jest.fn().mockReturnValue(' actionValue ');

      await expect(pageObject.perform(action)).resolves.toBe(' actionValue ');

      expect(element.perform).toHaveBeenCalledTimes(1);
      expect(element.perform).toHaveBeenLastCalledWith(action);

      await pageObject.perform(action, 'arg1', 'arg2');

      expect(element.perform).toHaveBeenCalledTimes(2);
      expect(element.perform).toHaveBeenLastCalledWith(action, 'arg1', 'arg2');
    });
  });

  describe('sendCharacter()', () => {
    it('should send the specified character to the DOM element', async () => {
      element.sendCharacter.mockImplementation(async () => {
        throw new Error('sendCharacterError');
      });

      await expect(pageObject.sendCharacter('c')).rejects.toThrow(
        'sendCharacterError'
      );

      expect(element.sendCharacter).toHaveBeenCalledTimes(1);
      expect(element.sendCharacter).toHaveBeenLastCalledWith('c');
    });
  });

  describe('sendKey()', () => {
    it('should send the specified key to the DOM element', async () => {
      element.sendKey.mockImplementation(async () => {
        throw new Error('sendKeyError');
      });

      await expect(pageObject.sendKey(StandardKey.ENTER)).rejects.toThrow(
        'sendKeyError'
      );

      expect(element.sendKey).toHaveBeenCalledTimes(1);
      expect(element.sendKey).toHaveBeenLastCalledWith(StandardKey.ENTER);
    });
  });

  describe('blur()', () => {
    it('should blur the DOM element', async () => {
      domElement.blur.mockImplementation(() => {
        throw new Error('blurError');
      });

      await expect(pageObject.blur()).rejects.toThrow('blurError');

      expect(domElement.blur).toHaveBeenCalledTimes(1);
      expect(domElement.blur).toHaveBeenLastCalledWith();
    });
  });

  describe('focus()', () => {
    it('should focus the DOM element', async () => {
      domElement.focus.mockImplementation(() => {
        throw new Error('focusError');
      });

      await expect(pageObject.focus()).rejects.toThrow('focusError');

      expect(domElement.focus).toHaveBeenCalledTimes(1);
      expect(domElement.focus).toHaveBeenLastCalledWith();
    });
  });

  describe('scrollIntoView()', () => {
    it('should scroll the DOM element into view', async () => {
      domElement.scrollIntoView.mockImplementation(() => {
        throw new Error('scrollIntoViewError');
      });

      await expect(pageObject.scrollIntoView()).rejects.toThrow(
        'scrollIntoViewError'
      );

      expect(domElement.scrollIntoView).toHaveBeenCalledTimes(1);
      expect(domElement.scrollIntoView).toHaveBeenLastCalledWith(true);

      domElement.scrollIntoView.mockReset();

      await pageObject.scrollIntoView(false);

      expect(domElement.scrollIntoView).toHaveBeenCalledTimes(1);
      expect(domElement.scrollIntoView).toHaveBeenLastCalledWith(false);
    });
  });

  describe('type()', () => {
    it('should type into the DOM element', async () => {
      jest.useFakeTimers();

      try {
        const typePromise = pageObject.type('text');

        await nap();

        expect(element.sendCharacter).toHaveBeenCalledTimes(1);
        expect(element.sendCharacter).toHaveBeenLastCalledWith('t');

        jest.advanceTimersByTime(99);

        await nap();

        expect(element.sendCharacter).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(1);

        await nap();

        expect(element.sendCharacter).toHaveBeenCalledTimes(2);
        expect(element.sendCharacter).toHaveBeenLastCalledWith('e');

        jest.advanceTimersByTime(100);

        await nap();

        expect(element.sendCharacter).toHaveBeenCalledTimes(3);
        expect(element.sendCharacter).toHaveBeenLastCalledWith('x');

        jest.advanceTimersByTime(100);

        await nap();

        expect(element.sendCharacter).toHaveBeenCalledTimes(4);
        expect(element.sendCharacter).toHaveBeenLastCalledWith('t');

        await typePromise;

        await pageObject.type('');

        expect(element.sendCharacter).toHaveBeenCalledTimes(4);
      } finally {
        jest.useRealTimers();
      }
    });
  });

  describe('getAttribute()', () => {
    it('should get the specified attribute of the DOM element', async () => {
      domElement.getAttribute.mockReturnValue(' attributeValue ');

      await expect(pageObject.getAttribute('attributeName')).resolves.toBe(
        'attributeValue'
      );

      expect(domElement.getAttribute).toHaveBeenCalledTimes(1);
      expect(domElement.getAttribute).toHaveBeenLastCalledWith('attributeName');

      domElement.getAttribute.mockReturnValue('');

      await expect(pageObject.getAttribute('attributeName')).resolves.toBe('');

      domElement.getAttribute.mockReturnValue(null);

      await expect(pageObject.getAttribute('attributeName')).resolves.toBe('');
    });
  });

  describe('getHTML()', () => {
    it('should get the `outerHTML` property of the DOM element', async () => {
      await expect(pageObject.getHTML()).resolves.toBe('outerHTMLValue');
    });
  });

  describe('getPageTitle()', () => {
    it('should get the current page title', async () => {
      document.title = ' pageTitle ';

      await expect(pageObject.getPageTitle()).resolves.toBe('pageTitle');
    });
  });

  describe('getPageURL()', () => {
    it('should get the current page URL', async () => {
      await expect(pageObject.getPageURL()).resolves.toBe('about:blank');
    });
  });

  describe('getProperty()', () => {
    it('should get the specified property of the DOM element', async () => {
      await expect(pageObject.getProperty('any')).resolves.toBe('anyValue');

      domElement.any = false;

      await expect(pageObject.getProperty('any')).resolves.toBe('false');

      domElement.any = 0;

      await expect(pageObject.getProperty('any')).resolves.toBe('0');

      domElement.any = '';

      await expect(pageObject.getProperty('any')).resolves.toBe('');

      domElement.any = null;

      await expect(pageObject.getProperty('any')).resolves.toBe('');

      domElement.any = undefined;

      await expect(pageObject.getProperty('any')).resolves.toBe('');

      domElement.any = {};

      await expect(pageObject.getProperty('any')).rejects.toThrow(
        'Unable to get non-primitive property (any)'
      );
    });
  });

  describe('getStyle()', () => {
    it('should get the specified style property of the DOM element', async () => {
      const getPropertyValue = jest.fn().mockReturnValue(' styleValue ');

      getComputedStyle.mockImplementation(() => ({getPropertyValue}));

      await expect(pageObject.getStyle('styleName')).resolves.toBe(
        'styleValue'
      );

      expect(getComputedStyle).toHaveBeenCalledTimes(1);
      expect(getComputedStyle).toHaveBeenLastCalledWith(domElement);

      expect(getPropertyValue).toHaveBeenCalledTimes(1);
      expect(getPropertyValue).toHaveBeenLastCalledWith('styleName');
    });
  });

  describe('getText()', () => {
    it('should get the `innerText` property of the DOM element', async () => {
      await expect(pageObject.getText()).resolves.toBe('innerTextValue');
    });
  });

  describe('isExisting()', () => {
    it('should return true', async () => {
      await expect(pageObject.isExisting()).resolves.toBe(true);
    });

    it('should return false', async () => {
      findElements.mockImplementation(async () => []);

      await expect(pageObject.isExisting()).resolves.toBe(false);

      findElements.mockImplementation(async () => [element, element]);

      await expect(pageObject.isExisting()).resolves.toBe(false);
    });
  });

  describe('isVisible()', () => {
    it('should return true', async () => {
      const getPropertyValue = jest
        .fn()
        .mockReturnValueOnce('block')
        .mockReturnValueOnce('visible');

      getComputedStyle.mockImplementation(() => ({getPropertyValue}));

      await expect(pageObject.isVisible()).resolves.toBe(true);

      expect(getComputedStyle).toHaveBeenCalledTimes(2);
      expect(getComputedStyle).toHaveBeenLastCalledWith(domElement);

      expect(getPropertyValue).toHaveBeenCalledTimes(2);
      expect(getPropertyValue).toHaveBeenCalledWith('display');
      expect(getPropertyValue).toHaveBeenLastCalledWith('visibility');
    });

    it('should return false if the DOM element has the style property `display: none`', async () => {
      const getPropertyValue = jest.fn().mockReturnValue('none');

      getComputedStyle.mockImplementation(() => ({getPropertyValue}));

      await expect(pageObject.isVisible()).resolves.toBe(false);

      expect(getComputedStyle).toHaveBeenCalledTimes(1);
      expect(getComputedStyle).toHaveBeenLastCalledWith(domElement);

      expect(getPropertyValue).toHaveBeenCalledTimes(1);
      expect(getPropertyValue).toHaveBeenLastCalledWith('display');
    });

    it('should return false if the DOM element has the style property `visibility: hidden`', async () => {
      const getPropertyValue = jest
        .fn()
        .mockReturnValueOnce('block')
        .mockReturnValueOnce('hidden');

      getComputedStyle.mockImplementation(() => ({getPropertyValue}));

      await expect(pageObject.isVisible()).resolves.toBe(false);

      expect(getComputedStyle).toHaveBeenCalledTimes(2);
      expect(getComputedStyle).toHaveBeenLastCalledWith(domElement);

      expect(getPropertyValue).toHaveBeenCalledTimes(2);
      expect(getPropertyValue).toHaveBeenCalledWith('display');
      expect(getPropertyValue).toHaveBeenLastCalledWith('visibility');
    });
  });
});
