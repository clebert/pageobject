import {ok, strictEqual} from 'assert';
import {join} from 'path';
import {WebDriver} from '.';

const url = `file://${join(__dirname, '../fixtures/index.html')}`;

async function getPageTitle(driver: WebDriver): Promise<string> {
  // istanbul ignore next
  return driver.execute(() => document.title);
}

export class WebDriverTest {
  private readonly _driver: WebDriver;

  public constructor(driver: WebDriver) {
    this._driver = driver;
  }

  public async testAll(): Promise<void> {
    await this.testDriverExecute();
    await this.testDriverFindElements();
    await this.testDriverNavigateTo();
    await this.testDriverPress();

    await this.testElementClick();
    await this.testElementDoubleClick();
    await this.testElementExecute();
  }

  public async testDriverExecute(): Promise<void> {
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

  public async testDriverFindElements(): Promise<void> {
    await this._driver.navigateTo(url);

    const divs = await this._driver.findElements('div');

    strictEqual(divs.length, 2);

    strictEqual((await this._driver.findElements('div', divs[0])).length, 1);
    strictEqual((await this._driver.findElements('div', divs[1])).length, 0);

    strictEqual((await this._driver.findElements('unknown')).length, 0);
  }

  public async testDriverNavigateTo(): Promise<void> {
    await this._driver.navigateTo(url);

    strictEqual(await getPageTitle(this._driver), 'Test');

    await this._driver.navigateTo('http://example.com');

    strictEqual(await getPageTitle(this._driver), 'Example Domain');
  }

  public async testDriverPress(): Promise<void> {
    await this._driver.navigateTo(url);

    strictEqual(await getPageTitle(this._driver), 'Test');

    await this._driver.press('a');

    strictEqual(
      await getPageTitle(this._driver),
      'Event: keydown a, keypress a, keyup a'
    );

    await this._driver.press('Enter');

    strictEqual(
      await getPageTitle(this._driver),
      'Event: keydown Enter, keypress Enter, keyup Enter'
    );

    await this._driver.press('Escape');

    strictEqual(
      await getPageTitle(this._driver),
      'Event: keydown Escape, keyup Escape'
    );

    await this._driver.press('Tab');

    strictEqual(
      await getPageTitle(this._driver),
      'Event: keydown Tab, keyup Tab'
    );
  }

  public async testElementClick(): Promise<void> {
    await this._driver.navigateTo(url);

    const button = (await this._driver.findElements('#click'))[0];

    strictEqual(await getPageTitle(this._driver), 'Test');

    await button.click();

    strictEqual(await getPageTitle(this._driver), 'Event: click');
  }

  public async testElementDoubleClick(): Promise<void> {
    await this._driver.navigateTo(url);

    const button = (await this._driver.findElements('#dblclick'))[0];

    strictEqual(await getPageTitle(this._driver), 'Test');

    await button.doubleClick();

    strictEqual(await getPageTitle(this._driver), 'Event: dblclick');
  }

  public async testElementExecute(): Promise<void> {
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
