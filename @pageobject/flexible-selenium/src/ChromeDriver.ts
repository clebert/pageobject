import {ChildProcess, spawn} from 'child_process';
import {join} from 'path';

export class ChromeDriver {
  private _childProcess: ChildProcess | undefined;

  public async start(port: number, urlBase: string = '/wd/hub'): Promise<void> {
    const childProcess = (this._childProcess = spawn(
      join(require.resolve('chromedriver'), '../chromedriver/chromedriver'),
      [`--url-base=${urlBase}`, `--port=${port}`]
    ));

    process.env.SELENIUM_REMOTE_URL = `http://localhost:${port}${urlBase}`;

    return new Promise<void>((resolve, reject) => {
      childProcess.stdout.once('data', () => {
        setTimeout(resolve, 500);
      });

      childProcess.once('error', reject);
    });
  }

  public stop(): void {
    /* istanbul ignore next */
    if (this._childProcess) {
      this._childProcess.kill();
    }
  }
}
