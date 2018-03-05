import {ChildProcess, spawn} from 'child_process';

/* tslint:disable-next-line no-implicit-dependencies */
const updateConfig = require('webdriver-manager/selenium/update-config.json');

export class ChromeDriver {
  private _childProcess: ChildProcess | undefined;

  public async start(port: number, urlBase: string = '/wd/hub'): Promise<void> {
    const childProcess = (this._childProcess = spawn(updateConfig.chrome.last, [
      `--url-base=${urlBase}`,
      `--port=${port}`
    ]));

    process.env.SELENIUM_REMOTE_URL = `http://localhost:${port}${urlBase}`;

    return new Promise<void>((resolve, reject) => {
      childProcess.stdout.on('data', resolve);
      childProcess.on('error', reject);
    });
  }

  public stop(): void {
    /* istanbul ignore next */
    if (this._childProcess) {
      this._childProcess.kill();
    }
  }
}
