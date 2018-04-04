import {Adapter, FunctionCall} from '@pageobject/base';
import {WebComponent, WebElement} from '.';

class TestComponent extends WebComponent {
  public readonly selector: string = ':root';
}

class TestAdapter implements Adapter<WebElement> {
  public readonly findElements = jest.fn();
}

class TestElement implements WebElement {
  public readonly click = jest.fn();
  public readonly doubleClick = jest.fn();
  public readonly execute = jest.fn();
}

class TestHTMLElement {
  public readonly getBoundingClientRect = jest.fn();
  public readonly innerText = 'text';

  public offsetHeight = 0;
  public offsetWidth = 0;
}

describe('WebComponent', () => {
  let adapter: TestAdapter;
  let component: WebComponent;
  let element: TestElement;
  let htmlElement: TestHTMLElement;

  let getActiveElement: jest.Mock;
  let scrollBy: jest.SpyInstance;

  beforeEach(() => {
    adapter = new TestAdapter();
    component = new TestComponent(adapter);
    element = new TestElement();
    htmlElement = new TestHTMLElement();

    adapter.findElements.mockResolvedValue([element]);

    element.execute.mockImplementation(async (script, ...args) =>
      script(htmlElement, ...args)
    );

    getActiveElement = jest.fn();

    Object.defineProperty(document, 'activeElement', {
      get: getActiveElement,
      configurable: true
    });

    scrollBy = jest.spyOn(window, 'scrollBy');
  });

  afterEach(() => {
    scrollBy.mockRestore();
  });

  describe('click() => FunctionCall', () => {
    let method: FunctionCall<void>;

    beforeEach(() => {
      method = component.click();
    });

    it('should have a context', () => {
      expect(method.context).toBe(component);
    });

    it('should have a description', () => {
      expect(method.description).toBe('click()');
    });

    describe('executable()', () => {
      it('should click on the element', async () => {
        element.click.mockRejectedValue(new Error('click'));

        await expect(method.executable()).rejects.toThrow('click');

        expect(element.click).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('doubleClick() => FunctionCall', () => {
    let method: FunctionCall<void>;

    beforeEach(() => {
      method = component.doubleClick();
    });

    it('should have a context', () => {
      expect(method.context).toBe(component);
    });

    it('should have a description', () => {
      expect(method.description).toBe('doubleClick()');
    });

    describe('executable()', () => {
      it('should double-click on the element', async () => {
        element.doubleClick.mockRejectedValue(new Error('doubleClick'));

        await expect(method.executable()).rejects.toThrow('doubleClick');

        expect(element.doubleClick).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('getText() => FunctionCall', () => {
    let getter: FunctionCall<string>;

    beforeEach(() => {
      getter = component.getText();
    });

    it('should have a context', () => {
      expect(getter.context).toBe(component);
    });

    it('should have a description', () => {
      expect(getter.description).toBe('getText()');
    });

    describe('executable()', () => {
      it('should return the text of the element', async () => {
        await expect(getter.executable()).resolves.toBe('text');
      });
    });
  });

  describe('hasFocus() => FunctionCall', () => {
    let getter: FunctionCall<boolean>;

    beforeEach(() => {
      getter = component.hasFocus();
    });

    it('should have a context', () => {
      expect(getter.context).toBe(component);
    });

    it('should have a description', () => {
      expect(getter.description).toBe('hasFocus()');
    });

    describe('executable()', () => {
      it('should return the focus of the element', async () => {
        await expect(getter.executable()).resolves.toBe(false);

        getActiveElement.mockReturnValue(htmlElement);

        await expect(getter.executable()).resolves.toBe(true);
      });
    });
  });

  describe('isVisible() => FunctionCall', () => {
    let getter: FunctionCall<boolean>;

    beforeEach(() => {
      getter = component.isVisible();
    });

    it('should have a context', () => {
      expect(getter.context).toBe(component);
    });

    it('should have a description', () => {
      expect(getter.description).toBe('isVisible()');
    });

    describe('executable()', () => {
      it('should return the visibility of the element', async () => {
        await expect(getter.executable()).resolves.toBe(false);

        htmlElement.offsetHeight = 1;
        htmlElement.offsetWidth = 0;

        await expect(getter.executable()).resolves.toBe(true);

        htmlElement.offsetHeight = 0;
        htmlElement.offsetWidth = 1;

        await expect(getter.executable()).resolves.toBe(true);

        htmlElement.offsetHeight = 1;
        htmlElement.offsetWidth = 1;

        await expect(getter.executable()).resolves.toBe(true);
      });
    });
  });

  describe('scrollIntoView() => FunctionCall', () => {
    let method: FunctionCall<void>;

    beforeEach(() => {
      method = component.scrollIntoView();
    });

    it('should have a context', () => {
      expect(method.context).toBe(component);
    });

    it('should have a description', () => {
      expect(method.description).toBe('scrollIntoView()');
    });

    describe('executable()', () => {
      it('should scroll the element into view', async () => {
        expect(window.innerHeight).toBe(768);
        expect(window.innerWidth).toBe(1024);

        htmlElement.getBoundingClientRect.mockReturnValue({
          height: 150,
          left: 12,
          top: 34,
          width: 50
        });

        scrollBy.mockImplementation(() => {
          throw new Error('scrollIntoView');
        });

        await expect(method.executable()).rejects.toEqual(
          new Error('scrollIntoView')
        );

        expect(scrollBy).toHaveBeenCalledTimes(1);
        expect(scrollBy).toHaveBeenLastCalledWith(-475, -275);
      });
    });
  });
});
