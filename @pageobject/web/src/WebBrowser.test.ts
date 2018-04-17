import {WebAdapter, WebBrowser} from '.';

class TestAdapter implements WebAdapter {
  public readonly execute = jest.fn();
  public readonly findNodes = jest.fn();
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

  describe('getPageTitle() => Effect()', () => {
    it('should return the page title', async () => {
      document.title = 'pageTitle';

      await expect(browser.getPageTitle()()).resolves.toBe('pageTitle');
    });
  });

  describe('getPageURL() => Effect()', () => {
    it('should return the page URL', async () => {
      await expect(browser.getPageURL()()).resolves.toBe('about:blank');
    });
  });

  describe('navigateTo() => Effect()', () => {
    it('should navigate to the specified url', async () => {
      adapter.navigateTo.mockImplementation(async () => {
        throw new Error('awaited');
      });

      await expect(browser.navigateTo('about:blank')()).rejects.toThrow(
        'awaited'
      );

      expect(adapter.navigateTo).toHaveBeenCalledTimes(1);
      expect(adapter.navigateTo).toHaveBeenCalledWith('about:blank');
    });
  });

  describe('press()', () => {
    it('should throw a single-character error', () => {
      const errorMessage =
        "Key must be a single character or one of: 'Enter', 'Escape', 'Tab'";

      expect(() => browser.press('')).toThrow(errorMessage);
      expect(() => browser.press('aa')).toThrow(errorMessage);
    });

    describe('=> Effect()', () => {
      it('should press the specified key', async () => {
        adapter.press.mockImplementation(async () => {
          throw new Error('awaited');
        });

        await expect(browser.press('a')()).rejects.toThrow('awaited');
        await expect(browser.press('Enter')()).rejects.toThrow('awaited');
        await expect(browser.press('Escape')()).rejects.toThrow('awaited');
        await expect(browser.press('Tab')()).rejects.toThrow('awaited');

        expect(adapter.press).toHaveBeenCalledTimes(4);

        expect(adapter.press).toHaveBeenCalledWith('a');
        expect(adapter.press).toHaveBeenCalledWith('Enter');
        expect(adapter.press).toHaveBeenCalledWith('Escape');
        expect(adapter.press).toHaveBeenLastCalledWith('Tab');
      });
    });
  });
});
