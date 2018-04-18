import {Adapter} from '@pageobject/base';
import {WebComponent, WebNode} from '.';

class TestAdapter implements Adapter<WebNode> {
  public readonly findNodes = jest.fn();
}

class TestComponent extends WebComponent {
  public static readonly selector: string = ':root';
}

class TestElement {
  public readonly getBoundingClientRect = jest.fn();
  public readonly innerText = '\n text \n';

  public offsetHeight = 0;
  public offsetWidth = 0;
}

class TestNode implements WebNode {
  public readonly click = jest.fn();
  public readonly doubleClick = jest.fn();
  public readonly execute = jest.fn();
}

describe('WebComponent', () => {
  let adapter: TestAdapter;
  let component: TestComponent;
  let element: TestElement;
  let node: TestNode;

  let getActiveElement: jest.Mock;
  let scrollBy: jest.SpyInstance;

  beforeEach(() => {
    adapter = new TestAdapter();
    component = new TestComponent(adapter);
    element = new TestElement();
    node = new TestNode();

    adapter.findNodes.mockImplementation(async () => [node]);

    node.execute.mockImplementation(async (script, ...args) =>
      script(element, ...args)
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

  describe('click() => Effect()', () => {
    it('should click on this component', async () => {
      node.click.mockImplementation(async () => {
        throw new Error('awaited');
      });

      await expect(component.click()()).rejects.toThrow('awaited');

      expect(node.click).toHaveBeenCalledTimes(1);
    });
  });

  describe('doubleClick() => Effect()', () => {
    it('should double-click on this component', async () => {
      node.doubleClick.mockImplementation(async () => {
        throw new Error('awaited');
      });

      await expect(component.doubleClick()()).rejects.toThrow('awaited');

      expect(node.doubleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('getText() => Effect()', () => {
    it('should return the text of this component', async () => {
      await expect(component.getText()()).resolves.toBe('text');
    });
  });

  describe('hasFocus() => Effect()', () => {
    it('should return the focus of this component', async () => {
      await expect(component.hasFocus()()).resolves.toBe(false);

      getActiveElement.mockReturnValue(element);

      await expect(component.hasFocus()()).resolves.toBe(true);
    });
  });

  describe('isVisible() => Effect()', () => {
    it('should return the visibility of this component', async () => {
      await expect(component.isVisible()()).resolves.toBe(false);

      element.offsetHeight = 1;
      element.offsetWidth = 0;

      await expect(component.isVisible()()).resolves.toBe(true);

      element.offsetHeight = 0;
      element.offsetWidth = 1;

      await expect(component.isVisible()()).resolves.toBe(true);

      element.offsetHeight = 1;
      element.offsetWidth = 1;

      await expect(component.isVisible()()).resolves.toBe(true);
    });
  });

  describe('scrollIntoView() => Effect()', () => {
    it('should scroll this component into view', async () => {
      expect(window.innerHeight).toBe(768);
      expect(window.innerWidth).toBe(1024);

      element.getBoundingClientRect.mockReturnValue({
        height: 150,
        left: 12,
        top: 34,
        width: 50
      });

      scrollBy.mockImplementation(() => {
        throw new Error('script');
      });

      await expect(component.scrollIntoView()()).rejects.toThrow('script');

      expect(scrollBy).toHaveBeenCalledTimes(1);
      expect(scrollBy).toHaveBeenLastCalledWith(-475, -275);
    });
  });
});
