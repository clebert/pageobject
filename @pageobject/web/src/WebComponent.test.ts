import {Effect, Locator} from '@pageobject/main';
import {WebComponent, WebDriver, WebElement} from '.';

class TestComponent extends WebComponent {
  public static create(
    driver: WebDriver,
    locator?: Locator<WebElement, TestComponent>
  ): TestComponent {
    return new TestComponent(driver, locator, TestComponent, ':root');
  }
}

class TestDriver implements WebDriver {
  public readonly execute = jest.fn();
  public readonly findElements = jest.fn();
  public readonly navigateTo = jest.fn();
  public readonly press = jest.fn();
  public readonly quit = jest.fn();
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
  let driver: TestDriver;
  let component: WebComponent;
  let element: TestElement;
  let htmlElement: TestHTMLElement;

  let getActiveElement: jest.Mock;
  let scrollBy: jest.SpyInstance;

  beforeEach(() => {
    driver = new TestDriver();
    component = TestComponent.create(driver);
    element = new TestElement();
    htmlElement = new TestHTMLElement();

    driver.findElements.mockResolvedValue([element]);

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

  describe('click() => Effect', () => {
    let effect: Effect<void>;

    beforeEach(() => {
      effect = component.click();
    });

    it('should have a context', () => {
      expect(effect.context).toBe(component);
    });

    it('should have a description', () => {
      expect(effect.description).toBe('click()');
    });

    describe('trigger()', () => {
      it('should click on the element', async () => {
        element.click.mockRejectedValue(new Error('click'));

        await expect(effect.trigger()).rejects.toThrow('click');

        expect(element.click).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('doubleClick() => Effect', () => {
    let effect: Effect<void>;

    beforeEach(() => {
      effect = component.doubleClick();
    });

    it('should have a context', () => {
      expect(effect.context).toBe(component);
    });

    it('should have a description', () => {
      expect(effect.description).toBe('doubleClick()');
    });

    describe('trigger()', () => {
      it('should double-click on the element', async () => {
        element.doubleClick.mockRejectedValue(new Error('doubleClick'));

        await expect(effect.trigger()).rejects.toThrow('doubleClick');

        expect(element.doubleClick).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('getText() => Effect', () => {
    let effect: Effect<string>;

    beforeEach(() => {
      effect = component.getText();
    });

    it('should have a context', () => {
      expect(effect.context).toBe(component);
    });

    it('should have a description', () => {
      expect(effect.description).toBe('getText()');
    });

    describe('trigger()', () => {
      it('should return the text of the element', async () => {
        await expect(effect.trigger()).resolves.toBe('text');
      });
    });
  });

  describe('hasFocus() => Effect', () => {
    let effect: Effect<boolean>;

    beforeEach(() => {
      effect = component.hasFocus();
    });

    it('should have a context', () => {
      expect(effect.context).toBe(component);
    });

    it('should have a description', () => {
      expect(effect.description).toBe('hasFocus()');
    });

    describe('trigger()', () => {
      it('should return the focus of the element', async () => {
        await expect(effect.trigger()).resolves.toBe(false);

        getActiveElement.mockReturnValue(htmlElement);

        await expect(effect.trigger()).resolves.toBe(true);
      });
    });
  });

  describe('isVisible() => Effect', () => {
    let effect: Effect<boolean>;

    beforeEach(() => {
      effect = component.isVisible();
    });

    it('should have a context', () => {
      expect(effect.context).toBe(component);
    });

    it('should have a description', () => {
      expect(effect.description).toBe('isVisible()');
    });

    describe('trigger()', () => {
      it('should return the visibility of the element', async () => {
        await expect(effect.trigger()).resolves.toBe(false);

        htmlElement.offsetHeight = 1;
        htmlElement.offsetWidth = 0;

        await expect(effect.trigger()).resolves.toBe(true);

        htmlElement.offsetHeight = 0;
        htmlElement.offsetWidth = 1;

        await expect(effect.trigger()).resolves.toBe(true);

        htmlElement.offsetHeight = 1;
        htmlElement.offsetWidth = 1;

        await expect(effect.trigger()).resolves.toBe(true);
      });
    });
  });

  describe('scrollIntoView() => Effect', () => {
    let effect: Effect<void>;

    beforeEach(() => {
      effect = component.scrollIntoView();
    });

    it('should have a context', () => {
      expect(effect.context).toBe(component);
    });

    it('should have a description', () => {
      expect(effect.description).toBe('scrollIntoView()');
    });

    describe('trigger()', () => {
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

        await expect(effect.trigger()).rejects.toEqual(
          new Error('scrollIntoView')
        );

        expect(scrollBy).toHaveBeenCalledTimes(1);
        expect(scrollBy).toHaveBeenLastCalledWith(-475, -275);
      });
    });
  });
});
