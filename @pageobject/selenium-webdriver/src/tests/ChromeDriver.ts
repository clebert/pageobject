import {ChildProcess, spawn} from 'child_process';

const updateConfig = require('webdriver-manager/selenium/update-config.json');

export class ChromeDriver {
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
