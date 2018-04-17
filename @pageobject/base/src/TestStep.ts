import {Effect, Predicate} from '.';

export class TestStep {
  public static defaultTimeoutInSeconds = 5;

  public static assert<TValue>(
    effect: Effect<TValue>,
    predicate: Predicate<TValue>,
    timeoutInSeconds?: number
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
    timeoutInSeconds?: number
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
    timeoutInSeconds?: number
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

  public readonly effect: Effect<TestStep[]>;
  public readonly retryOnError: boolean;
  public readonly timeoutInSeconds: number;

  public constructor(
    effect: Effect<TestStep[]>,
    retryOnError: boolean,
    timeoutInSeconds: number = TestStep.defaultTimeoutInSeconds
  ) {
    this.effect = effect;
    this.retryOnError = retryOnError;
    this.timeoutInSeconds = timeoutInSeconds;
  }

  public async run(): Promise<TestStep[]> {
    const {effect, retryOnError, timeoutInSeconds} = this;

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
