import {ok, strictEqual} from 'assert';
import {join} from 'path';
import {WebDriver} from '.';

const url = `file://${join(__dirname, '../fixtures/index.html')}`;

export class WebDriverTest {
  private readonly _driver: WebDriver;

  public constructor(driver: WebDriver) {
    this._driver = driver;
  }

  public async run(): Promise<void> {
    try {
      await this._testDriverExecute();
      await this._testDriverFindElements();
      await this._testDriverNavigateTo();
      await this._testDriverPress();

      await this._testElementClick();
      await this._testElementDoubleClick();
      await this._testElementExecute();
    } finally {
      await this._driver.quit();
    }
  }

  private async _getPageTitle(): Promise<string> {
    // istanbul ignore next
    return this._driver.execute(() => document.title);
  }

  private async _testDriverExecute(): Promise<void> {
    await this._driver.navigateTo(url);

    // istanbul ignore next
    strictEqual(
      await this._driver.execute(
        (...args) => [document.title, ...args].join(','),
        'arg1',
        'arg2'
      ),
      'Test,arg1,arg2'
    );

    let scriptError = new Error();

    try {
      // istanbul ignore next
      await this._driver.execute(() => {
        throw new Error('execute');
      });
    } catch (error) {
      scriptError = error;
    }

    ok(/execute/.test(scriptError.message));
  }

  private async _testDriverFindElements(): Promise<void> {
    await this._driver.navigateTo(url);

    const divs = await this._driver.findElements('div');

    strictEqual(divs.length, 2);

    strictEqual((await this._driver.findElements('div', divs[0])).length, 1);
    strictEqual((await this._driver.findElements('div', divs[1])).length, 0);

    strictEqual((await this._driver.findElements('unknown')).length, 0);
  }

  private async _testDriverNavigateTo(): Promise<void> {
    await this._driver.navigateTo(url);

    strictEqual(await this._getPageTitle(), 'Test');

    await this._driver.navigateTo('http://example.com');

    strictEqual(await this._getPageTitle(), 'Example Domain');
  }

  private async _testDriverPress(): Promise<void> {
    await this._driver.navigateTo(url);

    strictEqual(await this._getPageTitle(), 'Test');

    await this._driver.press('a');

    strictEqual(
      await this._getPageTitle(),
      'Event: keydown a, keypress a, keyup a'
    );

    await this._driver.press('Enter');

    strictEqual(
      await this._getPageTitle(),
      'Event: keydown Enter, keypress Enter, keyup Enter'
    );

    await this._driver.press('Escape');

    strictEqual(
      await this._getPageTitle(),
      'Event: keydown Escape, keyup Escape'
    );

    await this._driver.press('Tab');

    strictEqual(await this._getPageTitle(), 'Event: keydown Tab, keyup Tab');
  }

  private async _testElementClick(): Promise<void> {
    await this._driver.navigateTo(url);

    const button = (await this._driver.findElements('#click'))[0];

    strictEqual(await this._getPageTitle(), 'Test');

    await button.click();

    strictEqual(await this._getPageTitle(), 'Event: click');
  }

  private async _testElementDoubleClick(): Promise<void> {
    await this._driver.navigateTo(url);

    const button = (await this._driver.findElements('#dblclick'))[0];

    strictEqual(await this._getPageTitle(), 'Test');

    await button.doubleClick();

    strictEqual(await this._getPageTitle(), 'Event: dblclick');
  }

  private async _testElementExecute(): Promise<void> {
    await this._driver.navigateTo(url);

    const root = (await this._driver.findElements('#text'))[0];

    // istanbul ignore next
    strictEqual(
      await root.execute(
        (element, ...args) =>
          [document.title, element.innerText, ...args].join(','),
        'arg1',
        'arg2'
      ),
      'Test,text,arg1,arg2'
    );

    let scriptError = new Error();

    try {
      // istanbul ignore next
      await this._driver.execute(() => {
        throw new Error('execute');
      });
    } catch (error) {
      scriptError = error;
    }

    ok(/execute/.test(scriptError.message));
  }
}
