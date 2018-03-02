/* tslint:disable no-any */

import {TestCase} from '.';

class ConditionMock {
  public readonly assert = jest.fn();
  public readonly describe = jest.fn().mockReturnValue('description');
  public readonly test = jest.fn();
}

class ActionMock {
  public readonly description = 'description';
  public readonly perform = jest.fn();
}

class ObservablePromise<T> {
  public readonly promise: Promise<T>;

  private _pending = true;

  public constructor(promise: Promise<T>) {
    this.promise = (async () => {
      try {
        return await promise;
      } finally {
        this._pending = false;
      }
    })();
  }

  public async isPending(): Promise<boolean> {
    for (let i = 0; i < 100; i += 1) {
      await Promise.resolve();
    }

    return this._pending;
  }
}

async function observeTimeout<T>(
  executable: () => Promise<T>,
  valueInSeconds: number
): Promise<void> {
  const valueInMilliseconds = valueInSeconds * 1000;

  jest.useFakeTimers();

  try {
    const execution = new ObservablePromise(executable());

    for (let i = 0; i < valueInMilliseconds; i += 1) {
      jest.runAllTicks();
      jest.runAllImmediates();
      jest.advanceTimersByTime(1);

      if ((await execution.isPending()) !== i + 1 < valueInMilliseconds) {
        throw new Error('To early timeout');
      }
    }

    await execution.promise;
  } finally {
    jest.useRealTimers();
  }
}

const erroneous = (id?: number) => async () => {
  throw new Error(id !== undefined ? `Error ${id}` : 'Error');
};

const neverEnding = async () => new Promise<void>(() => undefined);

describe('TestCase', () => {
  let testCase: TestCase;

  beforeEach(() => {
    testCase = new TestCase(0.1);
  });

  describe('assert().run()', () => {
    it('should assert the specified condition', async () => {
      const condition = new ConditionMock();

      condition.assert.mockImplementationOnce(erroneous());

      await testCase.assert(condition as any).run();

      expect(condition.assert).toHaveBeenCalledTimes(2);
    });

    it('should throw an assertion error', async () => {
      const condition = new ConditionMock();

      condition.assert
        .mockImplementationOnce(erroneous(1))
        .mockImplementationOnce(erroneous(2))
        .mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(
          async () => testCase.assert(condition as any).run(),
          testCase.defaultTimeoutInSeconds
        )
      ).rejects.toEqual(new Error('Assert: description\n  Cause: Error 2'));

      expect(condition.assert).toHaveBeenCalledTimes(3);
    });

    it('should throw a default-timeout error', async () => {
      const condition = new ConditionMock();

      condition.assert.mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(
          async () => testCase.assert(condition as any).run(),
          testCase.defaultTimeoutInSeconds
        )
      ).rejects.toEqual(
        new Error('Assert: description\n  Cause: Timeout after 0.1 seconds')
      );

      expect(condition.assert).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom-timeout error', async () => {
      const condition = new ConditionMock();

      condition.assert.mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(
          async () => testCase.assert(condition as any, 0.2).run(),
          0.2
        )
      ).rejects.toEqual(
        new Error('Assert: description\n  Cause: Timeout after 0.2 seconds')
      );

      expect(condition.assert).toHaveBeenCalledTimes(1);
    });

    it('should not throw an out-of-memory error', async () => {
      const condition = new ConditionMock();

      condition.assert.mockImplementation(erroneous());

      await expect(testCase.assert(condition as any).run()).rejects.toEqual(
        new Error('Assert: description\n  Cause: Error')
      );
    });
  });

  describe('perform().run()', () => {
    it('should perform the specified action', async () => {
      const action = new ActionMock();

      await testCase.perform(action).run();

      expect(action.perform).toHaveBeenCalledTimes(1);
    });

    it('should throw an action error', async () => {
      const action = new ActionMock();

      action.perform.mockImplementationOnce(erroneous());

      await expect(testCase.perform(action).run()).rejects.toEqual(
        new Error('Perform: description\n  Cause: Error')
      );
    });

    it('should throw a default-timeout error', async () => {
      const action = new ActionMock();

      action.perform.mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(
          async () => testCase.perform(action).run(),
          testCase.defaultTimeoutInSeconds
        )
      ).rejects.toEqual(
        new Error('Perform: description\n  Cause: Timeout after 0.1 seconds')
      );
    });

    it('should throw a custom-timeout error', async () => {
      const action = new ActionMock();

      action.perform.mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(async () => testCase.perform(action, 0.2).run(), 0.2)
      ).rejects.toEqual(
        new Error('Perform: description\n  Cause: Timeout after 0.2 seconds')
      );
    });
  });

  describe('when().run()', () => {
    it('should run the then-test-case', async () => {
      const condition = new ConditionMock();

      condition.test
        .mockImplementationOnce(erroneous())
        .mockImplementationOnce(async () => true);

      const thenAction = new ActionMock();
      const otherwiseAction = new ActionMock();

      await testCase
        .when(condition as any, (then, otherwise) => {
          then.perform(thenAction);
          otherwise.perform(otherwiseAction);
        })
        .run();

      expect(condition.test).toHaveBeenCalledTimes(2);
      expect(thenAction.perform).toHaveBeenCalledTimes(1);
      expect(otherwiseAction.perform).toHaveBeenCalledTimes(0);
    });

    it('should run the otherwise-test-case', async () => {
      const condition = new ConditionMock();

      condition.test
        .mockImplementationOnce(erroneous())
        .mockImplementationOnce(async () => false);

      const thenAction = new ActionMock();
      const otherwiseAction = new ActionMock();

      await testCase
        .when(condition as any, (then, otherwise) => {
          then.perform(thenAction);
          otherwise.perform(otherwiseAction);
        })
        .run();

      expect(condition.test).toHaveBeenCalledTimes(2);
      expect(thenAction.perform).toHaveBeenCalledTimes(0);
      expect(otherwiseAction.perform).toHaveBeenCalledTimes(1);
    });

    it('should throw a test-condition error', async () => {
      const condition = new ConditionMock();

      condition.test
        .mockImplementationOnce(erroneous(1))
        .mockImplementationOnce(erroneous(2))
        .mockImplementationOnce(neverEnding);

      const thenAction = new ActionMock();
      const otherwiseAction = new ActionMock();

      await expect(
        observeTimeout(
          async () =>
            testCase
              .when(condition as any, (then, otherwise) => {
                then.perform(thenAction);
                otherwise.perform(otherwiseAction);
              })
              .run(),
          testCase.defaultTimeoutInSeconds
        )
      ).rejects.toEqual(new Error('When: description\n  Cause: Error 2'));

      expect(condition.test).toHaveBeenCalledTimes(3);
      expect(thenAction.perform).toHaveBeenCalledTimes(0);
      expect(otherwiseAction.perform).toHaveBeenCalledTimes(0);
    });

    it('should throw a default-timeout error', async () => {
      const condition = new ConditionMock();

      condition.test.mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(
          async () => testCase.when(condition as any, () => undefined).run(),
          testCase.defaultTimeoutInSeconds
        )
      ).rejects.toEqual(
        new Error('When: description\n  Cause: Timeout after 0.1 seconds')
      );

      expect(condition.test).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom-timeout error', async () => {
      const condition = new ConditionMock();

      condition.test.mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(
          async () =>
            testCase.when(condition as any, () => undefined, 0.2).run(),
          0.2
        )
      ).rejects.toEqual(
        new Error('When: description\n  Cause: Timeout after 0.2 seconds')
      );

      expect(condition.test).toHaveBeenCalledTimes(1);
    });

    it('should not throw an out-of-memory error', async () => {
      const condition = new ConditionMock();

      condition.test.mockImplementation(erroneous());

      await expect(
        testCase.when(condition as any, () => undefined).run()
      ).rejects.toEqual(new Error('When: description\n  Cause: Error'));
    });
  });

  describe('run()', async () => {
    it('should run the test steps sequentially', async () => {
      const calls: string[] = [];

      const condition = new ConditionMock();

      condition.assert.mockImplementationOnce(async () => {
        calls.push('assert()');
      });

      condition.test.mockImplementationOnce(async () => true);

      const conditionalAction = new ActionMock();

      conditionalAction.perform.mockImplementationOnce(async () => {
        calls.push('when()');
      });

      const action = new ActionMock();

      action.perform.mockImplementationOnce(async () => {
        calls.push('perform()');
      });

      await testCase
        .assert(condition as any)
        .when(condition as any, then => then.perform(conditionalAction))
        .perform(action)
        .run();

      expect(calls).toEqual(['assert()', 'when()', 'perform()']);
    });

    it('should throw an already-run error', async () => {
      const promise = testCase.run();

      await expect(testCase.run()).rejects.toEqual(
        new Error(
          'This test case has already been run, please create a new one'
        )
      );

      await promise;
    });
  });
});
