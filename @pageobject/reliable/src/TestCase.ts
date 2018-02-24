import {Condition} from '.';

export type TestStep = () => Promise<void>;

export class TestCase {
  public readonly testStepTimeout: number;

  private readonly _testSteps: TestStep[] = [];

  public constructor(testStepTimeout: number) {
    this.testStepTimeout = testStepTimeout;
  }

  /* tslint:disable-next-line no-any */
  public assert(condition: Condition<any>): this {
    this._testSteps.push(async () => condition.assert(this.testStepTimeout));

    return this;
  }

  public perform(action: TestStep): this {
    this._testSteps.push(action);

    return this;
  }

  public when(
    condition: Condition<any> /* tslint:disable-line no-any */,
    then: (then: TestCase) => void,
    otherwise: (otherwise: TestCase) => void = () => undefined
  ): this {
    this._testSteps.push(async () => {
      const subTestCase = new TestCase(this.testStepTimeout);

      if (await condition.test(this.testStepTimeout)) {
        then(subTestCase);
      } else {
        otherwise(subTestCase);
      }

      await subTestCase.run();
    });

    return this;
  }

  public async run(): Promise<void> {
    for (const testStep of this._testSteps) {
      await testStep();
    }
  }
}
