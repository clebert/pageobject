import {Accessor, Condition} from '.';

export type TestStep = () => Promise<void>;

function reliable<TValue>(
  accessor: Accessor<TValue>,
  timeout: number
): Accessor<TValue> {
  return async () => {
    let error = new Error(`Assertion timeout after ${timeout} milliseconds`);
    let resolved = false;

    let timeoutID: any; /* tslint:disable-line no-any */

    return Promise.race([
      (async () => {
        while (!resolved) {
          try {
            const result = await accessor();

            clearTimeout(timeoutID);

            return result;
          } catch (e) {
            error = e;
          }

          await new Promise<void>(setImmediate);
        }

        /* istanbul ignore next */
        throw error;
      })(),
      (async () => {
        await new Promise<void>(resolve => {
          timeoutID = setTimeout(resolve, timeout);
        });

        resolved = true;

        throw error;
      })()
    ]);
  };
}

export class TestCase {
  public readonly testStepTimeout: number;

  private readonly _testSteps: TestStep[] = [];

  public constructor(testStepTimeout: number) {
    this.testStepTimeout = testStepTimeout;
  }

  /* tslint:disable-next-line no-any */
  public assert(condition: Condition<any>): this {
    this._testSteps.push(
      reliable(async () => condition.assert(), this.testStepTimeout)
    );

    return this;
  }

  public perform(action: TestStep): this {
    this._testSteps.push(action);

    return this;
  }

  public async run(): Promise<void> {
    for (const testStep of this._testSteps) {
      await testStep();
    }
  }
}
