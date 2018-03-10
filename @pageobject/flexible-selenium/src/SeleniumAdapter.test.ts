import {FlexibleAdapterTestSuite} from '@pageobject/flexible';
import {ChildProcess, spawn} from 'child_process';
import {SeleniumAdapter} from '.';

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

    /* istanbul ignore next */
    if (this._childProcess) {
      this._childProcess.kill();
    }
  }
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('SeleniumAdapter', () => {
  const chromeDriver = new ChromeDriver();

  beforeAll(async () => {
    await chromeDriver.start(4445);
  });

  afterAll(() => {
    chromeDriver.stop();
  });

  it('should pass the FlexibleAdapterTestSuite successfully', async () => {
    const adapter = await SeleniumAdapter.create({
      browserName: 'chrome',
      chromeOptions: {args: ['headless', 'disable-gpu']}
    });

    try {
      const testSuite = new FlexibleAdapterTestSuite(adapter);

      await testSuite.testAll();
    } finally {
      await adapter.driver.quit();
    }
  });
});
