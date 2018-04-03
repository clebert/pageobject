import {WebDriverTest} from '@pageobject/web';
import {ChildProcess, spawn} from 'child_process';
import getPort from 'get-port';
import {SeleniumWebDriver} from '.';

const updateConfig = require('webdriver-manager/selenium/update-config.json');

class ChromeDriver {
  private _childProcess: ChildProcess | undefined;

  public async start(port: number, urlBase: string = '/wd/hub'): Promise<void> {
    process.env.SELENIUM_REMOTE_URL = `http://localhost:${port}${urlBase}`;

    const childProcess = (this._childProcess = spawn(updateConfig.chrome.last, [
      `--url-base=${urlBase}`,
      `--port=${port}`
    ]));

    return new Promise<void>((resolve, reject) => {
      childProcess.stdout.once('data', () => {
        setTimeout(resolve, 500);
      });

      childProcess.once('error', reject);
    });
  }

  public stop(): void {
    process.env.SELENIUM_REMOTE_URL = undefined;

    if (this._childProcess) {
      this._childProcess.kill();
    }
  }
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('SeleniumWebDriver', () => {
  const chromeDriver = new ChromeDriver();

  beforeAll(async () => {
    await chromeDriver.start(await getPort());
  });

  afterAll(() => {
    chromeDriver.stop();
  });

  it('should pass the WebDriverTest successfully', async () => {
    const driver = await SeleniumWebDriver.create({
      browserName: 'chrome',
      chromeOptions: {args: ['headless', 'disable-gpu']}
    });

    try {
      await new WebDriverTest(driver).testAll();
    } finally {
      await driver.adaptee.quit();
    }
  });
});
