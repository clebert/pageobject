import {WebAdapterTest} from '@pageobject/web';
import {ChildProcess, spawn} from 'child_process';
import getPort from 'get-port';
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

    if (this._childProcess) {
      this._childProcess.kill();
    }
  }
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

const args =
  process.env.CI === 'true'
    ? [
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox'
      ]
    : ['--headless', '--disable-gpu'];

describe('SeleniumAdapter', () => {
  const chromeDriver = new ChromeDriver();

  beforeAll(async () => {
    await chromeDriver.start(await getPort());
  });

  afterAll(() => {
    chromeDriver.stop();
  });

  it('should pass the WebAdapterTest successfully', async () => {
    await new WebAdapterTest(
      await SeleniumAdapter.create({
        browserName: 'chrome',
        chromeOptions: {args}
      })
    ).run();
  });
});
