import {Keyboard, Page, WebAdapter, WebComponent, WebNode} from '.';

class TestAdapter implements WebAdapter {
  public readonly execute = jest.fn();
  public readonly findNodes = jest.fn();
  public readonly goto = jest.fn();
  public readonly press = jest.fn();
  public readonly quit = jest.fn();
}

class TestComponent extends WebComponent {
  public readonly selector: string = ':root';
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

    adapter.execute.mockImplementation(async (script, ...args) =>
      script(...args)
    );

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

  describe('keyboard', () => {
    it('should be an instance of the Keyboard class', () => {
      expect(component.keyboard).toBeInstanceOf(Keyboard);
    });

    describe('press() => Effect()', () => {
      it('should press the specified key', async () => {
        adapter.press.mockImplementation(async () => {
          throw new Error('awaited');
        });

        await expect(component.keyboard.press('Enter')()).rejects.toThrow(
          'awaited'
        );

        expect(adapter.press).toHaveBeenLastCalledWith('Enter');

        await expect(component.keyboard.press('Escape')()).rejects.toThrow(
          'awaited'
        );

        expect(adapter.press).toHaveBeenLastCalledWith('Escape');

        await expect(component.keyboard.press('Tab')()).rejects.toThrow(
          'awaited'
        );

        expect(adapter.press).toHaveBeenLastCalledWith('Tab');

        expect(adapter.press).toHaveBeenCalledTimes(3);
      });
    });

    describe('type() => Effect()', () => {
      it('should type the specified text', async () => {
        await component.keyboard.type('')();

        expect(adapter.press).toHaveBeenCalledTimes(0);

        await component.keyboard.type('abc')();

        expect(adapter.press).toHaveBeenCalledWith('a');
        expect(adapter.press).toHaveBeenCalledWith('b');
        expect(adapter.press).toHaveBeenLastCalledWith('c');

        expect(adapter.press).toHaveBeenCalledTimes(3);

        adapter.press.mockImplementation(async () => {
          throw new Error('awaited');
        });

        await expect(component.keyboard.type('abc')()).rejects.toThrow(
          'awaited'
        );

        expect(adapter.press).toHaveBeenCalledTimes(4);
      });
    });
  });

  describe('page', () => {
    it('should be an instance of the Page class', () => {
      expect(component.page).toBeInstanceOf(Page);
    });

    describe('getTitle() => Effect()', () => {
      it('should return the page title', async () => {
        document.title = 'pageTitle';

        console.log(document.title);

        await expect(component.page.getTitle()()).resolves.toBe('pageTitle');
      });
    });

    describe('getURL() => Effect()', () => {
      it('should return the page URL', async () => {
        await expect(component.page.getURL()()).resolves.toBe('about:blank');
      });
    });

    describe('goto() => Effect()', () => {
      it('should goto the specified url', async () => {
        adapter.goto.mockImplementation(async () => {
          throw new Error('awaited');
        });

        await expect(component.page.goto('about:blank')()).rejects.toThrow(
          'awaited'
        );

        expect(adapter.goto).toHaveBeenCalledTimes(1);
        expect(adapter.goto).toHaveBeenCalledWith('about:blank');
      });
    });
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

  describe('isExisting() => Effect()', () => {
    it('should return true', async () => {
      await expect(component.isExisting()()).resolves.toBe(true);

      adapter.findNodes.mockImplementation(async () => [node, node]);

      await expect(component.isExisting()()).resolves.toBe(true);
    });

    it('should return false', async () => {
      adapter.findNodes.mockImplementation(async () => []);

      await expect(component.isExisting()()).resolves.toBe(false);
    });
  });

  describe('isUnique() => Effect()', () => {
    it('should return true', async () => {
      await expect(component.isUnique()()).resolves.toBe(true);
    });

    it('should return false', async () => {
      adapter.findNodes.mockImplementation(async () => []);

      await expect(component.isUnique()()).resolves.toBe(false);

      adapter.findNodes.mockImplementation(async () => [node, node]);

      await expect(component.isUnique()()).resolves.toBe(false);
    });
  });

  describe('isVisible() => Effect()', () => {
    it('should return true', async () => {
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

    it('should return false', async () => {
      await expect(component.isVisible()()).resolves.toBe(false);
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
