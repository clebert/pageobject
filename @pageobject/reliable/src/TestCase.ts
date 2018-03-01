import {Condition} from '.';

export interface Action {
  readonly description: string;

  perform(): Promise<void>;
}

type TestStep = () => Promise<void>;

function createError(name: string, description: string, cause: string): Error {
  return new Error(`${name}: ${description}\n  Cause: ${cause}`);
}

async function execute<TResult>(
  fn: () => Promise<TResult>,
  retryOnError: boolean,
  timeout: number
): Promise<TResult> {
  let message = `Timeout after ${timeout} milliseconds`;
  let resolved = false;
  let timeoutID: any; /* tslint:disable-line no-any */

  return Promise.race([
    (async () => {
      while (!resolved) {
        try {
          const result = await fn();

          clearTimeout(timeoutID);

          return result;
        } catch (e) {
          if (!retryOnError) {
            clearTimeout(timeoutID);

            throw e;
          }

          message = e.message;
        }

        await new Promise<void>(setImmediate);
      }

      throw new Error(message);
    })(),
    (async () => {
      await new Promise<void>(resolve => {
        timeoutID = setTimeout(resolve, timeout);
      });

      resolved = true;

      throw new Error(message);
    })()
  ]);
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
      try {
        await execute(async () => condition.assert(), true, timeout);
      } catch (e) {
        throw createError('Assert', condition.describe(), e.message);
      }
    });

    return this;
  }

  public perform(action: Action, timeout: number = this.defaultTimeout): this {
    this._testSteps.push(async () => {
      try {
        await execute(async () => action.perform(), false, timeout);
      } catch (e) {
        throw createError('Perform', action.description, e.message);
      }
    });

    return this;
  }

  public when(
    condition: Condition<any> /* tslint:disable-line no-any */,
    callback: (then: TestCase, otherwise: TestCase) => void,
    timeout: number = this.defaultTimeout
  ): this {
    this._testSteps.push(async () => {
      try {
        const result = await execute(
          async () => condition.test(),
          true,
          timeout
        );

        const then = new TestCase(this.defaultTimeout);
        const otherwise = new TestCase(this.defaultTimeout);

        callback(then, otherwise);

        if (result) {
          await then.run();
        } else {
          await otherwise.run();
        }
      } catch (e) {
        throw createError('When', condition.describe(), e.message);
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
