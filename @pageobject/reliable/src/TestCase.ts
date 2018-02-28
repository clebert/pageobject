import {Condition} from '.';

export interface Action {
  readonly description: string;

  perform(): Promise<void>;
}

type TestStep = () => Promise<void>;

function createError(name: string, description: string, cause: string): Error {
  return new Error(`${name}: ${description}\n  Cause: ${cause}`);
}

export class TestCase {
  public readonly defaultTimeout: number;

  private readonly _testSteps: TestStep[] = [];

  private _alreadyRun = false;

  public constructor(defaultTimeout: number) {
    this.defaultTimeout = defaultTimeout;
  }

  public assert(
    condition: Condition<any> /* tslint:disable-line no-any */,
    timeout: number = this.defaultTimeout
  ): this {
    this._testSteps.push(async () => {
      let cause = `Timeout after ${timeout} milliseconds`;
      let resolved = false;
      let timeoutID: any; /* tslint:disable-line no-any */

      return Promise.race([
        (async () => {
          while (!resolved) {
            try {
              await condition.assert();

              clearTimeout(timeoutID);

              return;
            } catch (e) {
              cause = e.message;
            }

            await new Promise<void>(setImmediate);
          }
        })(),
        (async () => {
          await new Promise<void>(resolve => {
            timeoutID = setTimeout(resolve, timeout);
          });

          resolved = true;

          throw createError('Assert', condition.describe(), cause);
        })()
      ]);
    });

    return this;
  }

  public perform(action: Action, timeout: number = this.defaultTimeout): this {
    this._testSteps.push(async () => {
      let timeoutID: any; /* tslint:disable-line no-any */

      return Promise.race([
        (async () => {
          try {
            await action.perform();
          } catch (e) {
            throw createError('Perfom', action.description, e.message);
          } finally {
            clearTimeout(timeoutID);
          }
        })(),
        (async () => {
          await new Promise<void>(resolve => {
            timeoutID = setTimeout(resolve, timeout);
          });

          throw createError(
            'Perfom',
            action.description,
            `Timeout after ${timeout} milliseconds`
          );
        })()
      ]);
    });

    return this;
  }

  public when(
    condition: Condition<any> /* tslint:disable-line no-any */,
    callback: (then: TestCase, otherwise: TestCase) => void
  ): this {
    this._testSteps.push(async () => {
      const thenTestCase = new TestCase(this.defaultTimeout);
      const otherwiseTestCase = new TestCase(this.defaultTimeout);

      callback(thenTestCase, otherwiseTestCase);

      let result: boolean;

      try {
        result = await condition.test();
      } catch (e) {
        throw createError('When', condition.describe(), e.message);
      }

      if (result) {
        await thenTestCase.run();
      } else {
        await otherwiseTestCase.run();
      }
    });

    return this;
  }

  public async run(): Promise<void> {
    if (this._alreadyRun) {
      throw new Error(
        'This test case has already been run, please create a new one'
      );
    }

    this._alreadyRun = true;

    for (const testStep of this._testSteps) {
      await testStep();
    }
  }
}
