import {Effect, Predicate} from '.';

export type ConditionalTestCallback = (thenTest: Test, elseTest: Test) => void;
export type TestCallback<TContext> = (test: Test, context: TContext) => void;

type TestStep = () => Promise<TestStep[]>;

function reliable(
  testStep: TestStep,
  retryOnError: boolean,
  timeoutInSeconds: number
): TestStep {
  return async () => {
    let message = `Timeout after ${timeoutInSeconds} second${
      timeoutInSeconds === 1 ? '' : 's'
    }`;

    let resolved = false;
    let timeoutID: any; // tslint:disable-line no-any

    return Promise.race([
      (async () => {
        while (!resolved) {
          try {
            const result = await testStep();

            clearTimeout(timeoutID);

            return result;
          } catch (error) {
            if (!retryOnError) {
              clearTimeout(timeoutID);

              throw error;
            }

            message = error.message;
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
  };
}

async function runAll(testSteps: TestStep[]): Promise<void> {
  for (const testStep of testSteps) {
    await runAll(await testStep());
  }
}

export class Test {
  public static async run<TContext>(
    context: TContext,
    defaultTimeoutInSeconds: number,
    callback: TestCallback<TContext>
  ): Promise<void> {
    const test = new Test(defaultTimeoutInSeconds);

    callback(test, context);

    return runAll(test._testSteps);
  }

  public readonly defaultTimeoutInSeconds: number;

  private readonly _testSteps: TestStep[] = [];

  private constructor(defaultTimeoutInSeconds: number) {
    this.defaultTimeoutInSeconds = defaultTimeoutInSeconds;
  }

  public assert<TValue>(
    value: Effect<TValue>,
    predicate: Predicate<TValue>,
    timeoutInSeconds: number = this.defaultTimeoutInSeconds
  ): this {
    const testStep = async () => {
      predicate.assert(await value());

      return [];
    };

    this._testSteps.push(reliable(testStep, true, timeoutInSeconds));

    return this;
  }

  public if<TValue>(
    value: Effect<TValue>,
    predicate: Predicate<TValue>,
    callback: ConditionalTestCallback,
    timeoutInSeconds: number = this.defaultTimeoutInSeconds
  ): this {
    const thenTest = new Test(this.defaultTimeoutInSeconds);
    const elseTest = new Test(this.defaultTimeoutInSeconds);

    callback(thenTest, elseTest);

    const testStep = async () =>
      predicate.test(await value()) ? thenTest._testSteps : elseTest._testSteps;

    this._testSteps.push(reliable(testStep, true, timeoutInSeconds));

    return this;
  }

  public perform(
    action: Effect<void>,
    timeoutInSeconds: number = this.defaultTimeoutInSeconds
  ): this {
    const testStep = async () => {
      await action();

      return [];
    };

    this._testSteps.push(reliable(testStep, false, timeoutInSeconds));

    return this;
  }
}
