import {Effect, Predicate} from '.';

export class TestStep {
  public static defaultTimeoutInSeconds = 5;

  public static assert<TValue>(
    effect: Effect<TValue>,
    predicate: Predicate<TValue>,
    timeoutInSeconds: number = TestStep.defaultTimeoutInSeconds
  ): TestStep {
    return new TestStep(
      async () => {
        predicate.assert(await effect());

        return [];
      },
      true,
      timeoutInSeconds
    );
  }

  public static if<TValue>(
    effect: Effect<TValue>,
    predicate: Predicate<TValue>,
    thenTestSteps: TestStep[],
    elseTestSteps: TestStep[] = [],
    timeoutInSeconds: number = TestStep.defaultTimeoutInSeconds
  ): TestStep {
    return new TestStep(
      async () =>
        predicate.test(await effect()) ? thenTestSteps : elseTestSteps,
      true,
      timeoutInSeconds
    );
  }

  public static perform(
    effect: Effect<void>,
    timeoutInSeconds: number = TestStep.defaultTimeoutInSeconds
  ): TestStep {
    return new TestStep(
      async () => {
        await effect();

        return [];
      },
      false,
      timeoutInSeconds
    );
  }

  public static async runAll(testSteps: TestStep[]): Promise<void> {
    for (const testStep of testSteps) {
      await TestStep.runAll(await testStep.run());
    }
  }

  private readonly _effect: Effect<TestStep[]>;
  private readonly _retryOnError: boolean;
  private readonly _timeoutInSeconds: number;

  private constructor(
    effect: Effect<TestStep[]>,
    retryOnError: boolean,
    timeoutInSeconds: number
  ) {
    this._effect = effect;
    this._retryOnError = retryOnError;
    this._timeoutInSeconds = timeoutInSeconds;
  }

  public async run(): Promise<TestStep[]> {
    const {
      _effect: effect,
      _retryOnError: retryOnError,
      _timeoutInSeconds: timeoutInSeconds
    } = this;

    let message = `Timeout after ${timeoutInSeconds} second${
      timeoutInSeconds === 1 ? '' : 's'
    }`;

    let resolved = false;
    let timeoutID: any; // tslint:disable-line no-any

    return Promise.race([
      (async () => {
        while (!resolved) {
          try {
            const result = await effect();

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
  }
}
