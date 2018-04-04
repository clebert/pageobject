import {Effect} from '@pageobject/base';
import {WebAdapter, WebBrowser} from '.';

class TestAdapter implements WebAdapter {
  public readonly execute = jest.fn();
  public readonly findElements = jest.fn();
  public readonly navigateTo = jest.fn();
  public readonly press = jest.fn();
  public readonly quit = jest.fn();
}

describe('WebBrowser', () => {
  let adapter: TestAdapter;
  let browser: WebBrowser;

  beforeEach(() => {
    adapter = new TestAdapter();
    browser = new WebBrowser(adapter);

    adapter.execute.mockImplementation(async (script, ...args) =>
      script(...args)
    );
  });

  it('should have a description', () => {
    expect(browser.description).toBe('WebBrowser');
  });

  describe('getPageTitle() => Effect', () => {
    let effect: Effect<string>;

    beforeEach(() => {
      effect = browser.getPageTitle();
    });

    it('should have a context', () => {
      expect(effect.context).toBe(browser);
    });

    it('should have a description', () => {
      expect(effect.description).toBe('getPageTitle()');
    });

    describe('trigger()', () => {
      it('should return the page title', async () => {
        document.title = 'pageTitle';

        await expect(effect.trigger()).resolves.toBe('pageTitle');
      });
    });
  });

  describe('getPageURL() => Effect', () => {
    let effect: Effect<string>;

    beforeEach(() => {
      effect = browser.getPageURL();
    });

    it('should have a context', () => {
      expect(effect.context).toBe(browser);
    });

    it('should have a description', () => {
      expect(effect.description).toBe('getPageURL()');
    });

    describe('trigger()', () => {
      it('should return the page URL', async () => {
        await expect(effect.trigger()).resolves.toBe('about:blank');
      });
    });
  });

  describe('navigateTo() => Effect', () => {
    let effect: Effect<void>;

    beforeEach(() => {
      effect = browser.navigateTo('about:blank');
    });

    it('should have a context', () => {
      expect(effect.context).toBe(browser);
    });

    it('should have a description', () => {
      expect(effect.description).toBe("navigateTo('about:blank')");
    });

    describe('trigger()', () => {
      it('should navigate to the specified url', async () => {
        adapter.navigateTo.mockRejectedValue(new Error('navigateTo'));

        await expect(effect.trigger()).rejects.toThrow('navigateTo');

        expect(adapter.navigateTo).toHaveBeenCalledTimes(1);
        expect(adapter.navigateTo).toHaveBeenCalledWith('about:blank');
      });
    });
  });

  describe('press()', () => {
    it('should throw an argument error', () => {
      const errorMessage =
        "Key must be a single character or one of: 'Enter', 'Escape', 'Tab'";

      expect(() => browser.press('')).toThrow(errorMessage);
      expect(() => browser.press('aa')).toThrow(errorMessage);
    });

    describe('=> Effect', () => {
      let effect: Effect<void>;

      beforeEach(() => {
        effect = browser.press('a');
      });

      it('should have a context', () => {
        expect(effect.context).toBe(browser);
      });

      it('should have a description', () => {
        expect(effect.description).toBe("press('a')");

        expect(browser.press('Enter').description).toBe("press('Enter')");
        expect(browser.press('Escape').description).toBe("press('Escape')");
        expect(browser.press('Tab').description).toBe("press('Tab')");
      });

      describe('trigger()', () => {
        it('should press the specified key', async () => {
          adapter.press.mockRejectedValue(new Error('press'));

          await expect(effect.trigger()).rejects.toThrow('press');

          expect(adapter.press).toHaveBeenCalledTimes(1);
          expect(adapter.press).toHaveBeenCalledWith('a');
        });
      });
    });
  });
});
