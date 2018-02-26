import {Condition} from '.';

export type TestStep = () => Promise<void>;

function reliable(assertion: TestStep, timeout: number): TestStep {
  return async () => {
    let error = new Error(`Assertion timeout after ${timeout} milliseconds`);
    let resolved = false;

    let timeoutID: any; /* tslint:disable-line no-any */

    return Promise.race([
      (async () => {
        while (!resolved) {
          try {
            await assertion();

            clearTimeout(timeoutID);

            return;
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
  public readonly assertionTimeout: number;

  private readonly _testSteps: TestStep[] = [];

  public constructor(assertionTimeout: number) {
    this.assertionTimeout = assertionTimeout;
  }

  /* tslint:disable-next-line no-any */
  public assert(condition: Condition<any>): this {
    this._testSteps.push(
      reliable(async () => condition.assert(), this.assertionTimeout)
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
