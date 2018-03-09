import {Condition} from '.';

export interface Action {
  readonly description: string;

  perform(): Promise<void>;
}

type TestStep = () => Promise<void>;

function createError(
  description: string,
  cause: string,
  prefix: string = ''
): Error {
  return new Error(`${prefix}${description}\n  Cause: ${cause}`);
}

async function execute<TResult>(
  fn: () => Promise<TResult>,
  retryOnError: boolean,
  timeoutInSeconds: number
): Promise<TResult> {
  let message = `Timeout after ${timeoutInSeconds} seconds`;
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
        timeoutID = setTimeout(resolve, timeoutInSeconds * 1000);
      });

      resolved = true;

      throw new Error(message);
    })()
  ]);
}

export class TestCase {
  public readonly defaultTimeoutInSeconds: number;

  private readonly _testSteps: TestStep[] = [];

  private _alreadyRun = false;

  public constructor(defaultTimeoutInSeconds: number) {
    this.defaultTimeoutInSeconds = defaultTimeoutInSeconds;
  }

  /**
   * Adds an assertion as the next test step to this test case.
   *
   * When this test case is run, then
   * - the evaluation of the `condition` is repeated as long as it evaluates to false or errors occur,
   *   but not longer than the `timeoutInSeconds`
   * - an error is thrown when the `timeoutInSeconds` is exceeded
   */
  public assert(
    condition: Condition,
    timeoutInSeconds: number = this.defaultTimeoutInSeconds
  ): this {
    this._testSteps.push(async () => {
      try {
        await execute(async () => condition.assert(), true, timeoutInSeconds);
      } catch (e) {
        throw createError(condition.describe(), e.message, 'Assert ');
      }
    });

    return this;
  }

  /**
   * Adds a conditional sub test case as the next test step to this test case.
   *
   * When this test case is run, then
   * - the evaluation of the `condition` is repeated as long as errors occur,
   *   but not longer than the `timeoutInSeconds`
   * - an error is thrown when the `timeoutInSeconds` is exceeded
   * - the `then` sub test case is run only when the `condition` evaluates to true
   * - the `otherwise` sub test case is run only when the `condition` evaluates to false
   * - the `timeoutInSeconds` does not affect the running of the conditional sub test case
   *
   * Example:
   *
   * ```js
   * testCase.if(webPage.lightboxAd.isExisting(), then =>
   *   then.perform(webPage.lightboxAd.closeButton.click())
   * );
   * ```
   */
  public if(
    condition: Condition,
    callback: (then: TestCase, otherwise: TestCase) => void,
    timeoutInSeconds: number = this.defaultTimeoutInSeconds
  ): this {
    this._testSteps.push(async () => {
      try {
        const result = await execute(
          async () => condition.test(),
          true,
          timeoutInSeconds
        );

        const then = new TestCase(this.defaultTimeoutInSeconds);
        const otherwise = new TestCase(this.defaultTimeoutInSeconds);

        callback(then, otherwise);

        if (result) {
          await then.run();
        } else {
          await otherwise.run();
        }
      } catch (e) {
        throw createError(condition.describe(), e.message, 'If ');
      }
    });

    return this;
  }

  /**
   * Adds a performance as the next test step to this test case.
   *
   * When this test case is run, then
   * - the `action` is performed once
   * - an error is thrown when the `action` fails or the `timeoutInSeconds` is exceeded
   */
  public perform(
    action: Action,
    timeoutInSeconds: number = this.defaultTimeoutInSeconds
  ): this {
    this._testSteps.push(async () => {
      try {
        await execute(async () => action.perform(), false, timeoutInSeconds);
      } catch (e) {
        throw createError(action.description, e.message);
      }
    });

    return this;
  }

  /**
   * Runs all test steps of this test case sequentially in the order in which they were added.
   */
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
