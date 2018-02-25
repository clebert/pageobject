/* tslint:disable no-any */

import {equals} from '@pageobject/reliable';
import {FlexibleKey, FlexiblePageObject} from '.';

interface DOMElementMock {
  any: any;
  innerText: string;
  outerHTML: string;
  offsetHeight: number;
  offsetWidth: number;

  readonly getAttribute: jest.Mock;
  readonly getBoundingClientRect: jest.Mock;
  readonly blur: jest.Mock;
  readonly focus: jest.Mock;
}

interface FlexibleElementMock {
  readonly click: jest.Mock;
  readonly doubleClick: jest.Mock;
  readonly execute: jest.Mock;
  readonly sendCharacter: jest.Mock;
  readonly sendKey: jest.Mock;
}

class PageObjectMock extends FlexiblePageObject {
  public readonly selector = ':mock';
}

async function nap(): Promise<void> {
  for (let i = 0; i < 10; i += 1) {
    await Promise.resolve();
  }
}

describe('FlexiblePageObject', () => {
  let getActiveElement: jest.Mock;
  let getComputedStyle: jest.SpyInstance;
  let scrollBy: jest.SpyInstance;
  let domElement: DOMElementMock;
  let element: FlexibleElementMock;
  let findElements: jest.Mock;
  let navigateTo: jest.Mock;
  let pageObject: PageObjectMock;

  beforeEach(() => {
    getActiveElement = jest.fn();

    Object.defineProperty(document, 'activeElement', {
      get: getActiveElement,
      configurable: true
    });

    getComputedStyle = jest.spyOn(window, 'getComputedStyle');
    scrollBy = jest.spyOn(window, 'scrollBy');

    domElement = {
      any: ' any ',
      innerText: ' innerText ',
      outerHTML: ' outerHTML ',
      offsetHeight: 1,
      offsetWidth: 1,
      getAttribute: jest.fn(),
      getBoundingClientRect: jest.fn(),
      blur: jest.fn(),
      focus: jest.fn()
    };

    getActiveElement.mockReturnValue(domElement);

    element = {
      click: jest.fn(),
      doubleClick: jest.fn(),
      execute: jest.fn(),
      sendCharacter: jest.fn(),
      sendKey: jest.fn()
    };

    element.execute.mockImplementation(async (action, ...args) =>
      action(domElement, ...args)
    );

    findElements = jest.fn().mockImplementation(async () => [element]);
    navigateTo = jest.fn();

    pageObject = new PageObjectMock({findElements, navigateTo});
  });

  afterEach(() => {
    getComputedStyle.mockRestore();
    scrollBy.mockRestore();
  });

  describe('click()', () => {
    it('should return an action', async () => {
      element.click.mockImplementation(async () => {
        throw new Error('click error');
      });

      await expect(pageObject.click()()).rejects.toEqual(
        new Error('click error')
      );

      expect(element.click).toHaveBeenCalledTimes(1);
      expect(element.click).toHaveBeenLastCalledWith();
    });
  });

  describe('doubleClick()', () => {
    it('should return an action', async () => {
      element.doubleClick.mockImplementation(async () => {
        throw new Error('doubleClick error');
      });

      await expect(pageObject.doubleClick()()).rejects.toEqual(
        new Error('doubleClick error')
      );

      expect(element.doubleClick).toHaveBeenCalledTimes(1);
      expect(element.doubleClick).toHaveBeenLastCalledWith();
    });
  });

  describe('navigateTo()', () => {
    it('should return an action', async () => {
      navigateTo.mockImplementation(async () => {
        throw new Error('navigateTo error');
      });

      await expect(pageObject.navigateTo('url')()).rejects.toEqual(
        new Error('navigateTo error')
      );

      expect(navigateTo).toHaveBeenCalledTimes(1);
      expect(navigateTo).toHaveBeenLastCalledWith('url');
    });
  });

  describe('sendKey()', () => {
    it('should return an action', async () => {
      element.sendKey.mockImplementation(async () => {
        throw new Error('sendKey error');
      });

      await expect(pageObject.sendKey(FlexibleKey.ENTER)()).rejects.toEqual(
        new Error('sendKey error')
      );

      expect(element.sendKey).toHaveBeenCalledTimes(1);
      expect(element.sendKey).toHaveBeenLastCalledWith(FlexibleKey.ENTER);
    });
  });

  describe('blur()', () => {
    it('should return an action', async () => {
      domElement.blur.mockImplementation(() => {
        throw new Error('blur error');
      });

      await expect(pageObject.blur()()).rejects.toEqual(
        new Error('blur error')
      );

      expect(domElement.blur).toHaveBeenCalledTimes(1);
      expect(domElement.blur).toHaveBeenLastCalledWith();
    });
  });

  describe('focus()', () => {
    it('should return an action', async () => {
      domElement.focus.mockImplementation(() => {
        throw new Error('focus error');
      });

      await expect(pageObject.focus()()).rejects.toEqual(
        new Error('focus error')
      );

      expect(domElement.focus).toHaveBeenCalledTimes(1);
      expect(domElement.focus).toHaveBeenLastCalledWith();
    });
  });

  describe('scrollIntoView()', () => {
    it('should return an action', async () => {
      domElement.getBoundingClientRect.mockReturnValue({
        height: 25,
        left: 500,
        top: 300,
        width: 50
      });

      scrollBy.mockImplementation(() => {
        throw new Error('scrollBy error');
      });

      await expect(pageObject.scrollIntoView()()).rejects.toEqual(
        new Error('scrollBy error')
      );

      expect(scrollBy).toHaveBeenCalledTimes(1);
      expect(scrollBy).toHaveBeenLastCalledWith(13, -71.5);
    });
  });

  describe('type()', () => {
    it('should return an action', async () => {
      jest.useFakeTimers();

      try {
        const typePromise = pageObject.type('text')();

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

        await pageObject.type('')();

        expect(element.sendCharacter).toHaveBeenCalledTimes(4);
      } finally {
        jest.useRealTimers();
      }
    });
  });

  describe('getAttribute()', () => {
    it('should return a condition', async () => {
      domElement.getAttribute.mockReturnValue(' attributeValue ');

      const condition = pageObject.getAttribute(
        'name',
        equals('attributeValue')
      );

      expect(condition.valueName).toBe('attribute: name');

      await expect(condition.test()).resolves.toBe(true);

      expect(domElement.getAttribute).toHaveBeenCalledTimes(1);
      expect(domElement.getAttribute).toHaveBeenLastCalledWith('name');

      domElement.getAttribute.mockReturnValue('');

      await expect(
        pageObject.getAttribute('name', equals('')).test()
      ).resolves.toBe(true);

      domElement.getAttribute.mockReturnValue(null);

      await expect(
        pageObject.getAttribute('name', equals('')).test()
      ).resolves.toBe(true);
    });
  });

  describe('getHTML()', () => {
    it('should return a condition', async () => {
      const condition = pageObject.getHTML(equals('outerHTML'));

      expect(condition.valueName).toBe('html');

      await expect(condition.test()).resolves.toBe(true);
    });
  });

  describe('getPageTitle()', () => {
    it('should return a condition', async () => {
      document.title = ' titleValue ';

      const condition = pageObject.getPageTitle(equals('titleValue'));

      expect(condition.valueName).toBe('pageTitle');

      await expect(condition.test()).resolves.toBe(true);
    });
  });

  describe('getPageURL()', () => {
    it('should return a condition', async () => {
      const condition = pageObject.getPageURL(equals('about:blank'));

      expect(condition.valueName).toBe('pageURL');

      await expect(condition.test()).resolves.toBe(true);
    });
  });

  describe('getProperty()', () => {
    it('should return a condition', async () => {
      const condition = pageObject.getProperty('any', equals('any'));

      expect(condition.valueName).toBe('property: any');

      await expect(condition.test()).resolves.toBe(true);

      domElement.any = false;

      await expect(
        pageObject.getProperty('any', equals('false')).test()
      ).resolves.toBe(true);

      domElement.any = 0;

      await expect(
        pageObject.getProperty('any', equals('0')).test()
      ).resolves.toBe(true);

      domElement.any = '';

      await expect(
        pageObject.getProperty('any', equals('')).test()
      ).resolves.toBe(true);

      domElement.any = null;

      await expect(
        pageObject.getProperty('any', equals('')).test()
      ).resolves.toBe(true);

      domElement.any = undefined;

      await expect(
        pageObject.getProperty('any', equals('')).test()
      ).resolves.toBe(true);

      domElement.any = {};

      await expect(
        pageObject.getProperty('any', equals('{}')).test()
      ).rejects.toEqual(
        new Error('Unable to access the non-primitive property: any')
      );
    });
  });

  describe('getComputedStyle()', () => {
    it('should return a condition', async () => {
      const getPropertyValue = jest.fn().mockReturnValue(' styleValue ');

      getComputedStyle.mockImplementation(() => ({getPropertyValue}));

      const condition = pageObject.getComputedStyle(
        'name',
        equals('styleValue')
      );

      expect(condition.valueName).toBe('computedStyle: name');

      await expect(condition.test()).resolves.toBe(true);

      expect(getComputedStyle).toHaveBeenCalledTimes(1);
      expect(getComputedStyle).toHaveBeenLastCalledWith(domElement);

      expect(getPropertyValue).toHaveBeenCalledTimes(1);
      expect(getPropertyValue).toHaveBeenLastCalledWith('name');
    });
  });

  describe('getRenderedText()', () => {
    it('should return a condition', async () => {
      const condition = pageObject.getRenderedText(equals('innerText'));

      expect(condition.valueName).toBe('renderedText');

      await expect(condition.test()).resolves.toBe(true);
    });
  });

  describe('hasFocus()', () => {
    it('should return a condition that sets <focus> to true', async () => {
      const condition = pageObject.hasFocus(equals(true));

      expect(condition.valueName).toBe('focus');

      await expect(condition.test()).resolves.toBe(true);
    });

    it('should return a condition that sets <focus> to false', async () => {
      getActiveElement.mockReturnValue({});

      await expect(pageObject.hasFocus(equals(false)).test()).resolves.toBe(
        true
      );
    });
  });

  describe('isInView()', () => {
    it('should return a condition that sets <inView> to true', async () => {
      domElement.getBoundingClientRect.mockReturnValue({
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
      });

      const condition = pageObject.isInView(equals(true));

      expect(condition.valueName).toBe('inView');

      await expect(condition.test()).resolves.toBe(true);

      domElement.getBoundingClientRect.mockReturnValue({
        bottom: window.innerHeight,
        left: 0,
        right: window.innerWidth,
        top: 0
      });

      await expect(pageObject.isInView(equals(true)).test()).resolves.toBe(
        true
      );
    });

    it('should return a condition that sets <inView> to false', async () => {
      domElement.getBoundingClientRect.mockReturnValue({
        bottom: window.innerHeight,
        left: 0,
        right: window.innerWidth,
        top: -1
      });

      await expect(pageObject.isInView(equals(false)).test()).resolves.toBe(
        true
      );

      domElement.getBoundingClientRect.mockReturnValue({
        bottom: window.innerHeight,
        left: -1,
        right: window.innerWidth,
        top: 0
      });

      await expect(pageObject.isInView(equals(false)).test()).resolves.toBe(
        true
      );

      domElement.getBoundingClientRect.mockReturnValue({
        bottom: window.innerHeight + 1,
        left: 0,
        right: window.innerWidth,
        top: 0
      });

      await expect(pageObject.isInView(equals(false)).test()).resolves.toBe(
        true
      );

      domElement.getBoundingClientRect.mockReturnValue({
        bottom: window.innerHeight,
        left: 0,
        right: window.innerWidth + 1,
        top: 0
      });

      await expect(pageObject.isInView(equals(false)).test()).resolves.toBe(
        true
      );
    });
  });

  describe('isVisible()', () => {
    it('should return a condition that sets <visible> to true', async () => {
      domElement.offsetHeight = 1;
      domElement.offsetWidth = 0;

      const condition = pageObject.isVisible(equals(true));

      expect(condition.valueName).toBe('visible');

      await expect(condition.test()).resolves.toBe(true);

      domElement.offsetHeight = 0;
      domElement.offsetWidth = 1;

      await expect(pageObject.isVisible(equals(true)).test()).resolves.toBe(
        true
      );

      domElement.offsetHeight = 1;
      domElement.offsetWidth = 1;

      await expect(pageObject.isVisible(equals(true)).test()).resolves.toBe(
        true
      );
    });

    it('should return a condition that sets <visible> to false', async () => {
      domElement.offsetHeight = 0;
      domElement.offsetWidth = 0;

      await expect(pageObject.isVisible(equals(false)).test()).resolves.toBe(
        true
      );
    });
  });
});
