/* tslint:disable no-any */

import {TestCase} from '.';

class ConditionMock {
  public readonly assert = jest.fn();
  public readonly describe = jest.fn().mockReturnValue('conditionDescription');
  public readonly test = jest.fn();
}

class ActionMock {
  public readonly description = 'actionDescription';
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

const defaultTimeoutInSeconds = 0.025;
const defaultTimeoutMessage = `Timeout after ${defaultTimeoutInSeconds} seconds`;

const customTimeoutInSeconds = defaultTimeoutInSeconds * 2;
const customTimeoutMessage = `Timeout after ${customTimeoutInSeconds} seconds`;

describe('TestCase', () => {
  let testCase: TestCase;

  beforeEach(() => {
    testCase = new TestCase(defaultTimeoutInSeconds);
  });

  describe('assert().run()', () => {
    it('should assert the <condition>', async () => {
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

      await expect(testCase.assert(condition as any).run()).rejects.toEqual(
        new Error('Assert conditionDescription\n  Cause: Error 2')
      );

      expect(condition.assert).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      const condition = new ConditionMock();

      condition.assert.mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(
          async () => testCase.assert(condition as any).run(),
          defaultTimeoutInSeconds
        )
      ).rejects.toEqual(
        new Error(
          `Assert conditionDescription\n  Cause: ${defaultTimeoutMessage}`
        )
      );

      expect(condition.assert).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      const condition = new ConditionMock();

      condition.assert.mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(
          async () =>
            testCase.assert(condition as any, customTimeoutInSeconds).run(),
          customTimeoutInSeconds
        )
      ).rejects.toEqual(
        new Error(
          `Assert conditionDescription\n  Cause: ${customTimeoutMessage}`
        )
      );

      expect(condition.assert).toHaveBeenCalledTimes(1);
    });

    it('should not throw an out-of-memory error', async () => {
      const condition = new ConditionMock();

      condition.assert.mockImplementation(erroneous());

      await expect(testCase.assert(condition as any).run()).rejects.toEqual(
        new Error('Assert conditionDescription\n  Cause: Error')
      );
    });
  });

  describe('if().run()', () => {
    it('should throw a <condition> error', async () => {
      const condition = new ConditionMock();

      condition.test
        .mockImplementationOnce(erroneous(1))
        .mockImplementationOnce(erroneous(2))
        .mockImplementationOnce(neverEnding);

      await expect(
        testCase.if(condition as any, () => undefined).run()
      ).rejects.toEqual(new Error('If conditionDescription\n  Cause: Error 2'));

      expect(condition.test).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      const condition = new ConditionMock();

      condition.test.mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(
          async () => testCase.if(condition as any, () => undefined).run(),
          defaultTimeoutInSeconds
        )
      ).rejects.toEqual(
        new Error(`If conditionDescription\n  Cause: ${defaultTimeoutMessage}`)
      );

      expect(condition.test).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      const condition = new ConditionMock();

      condition.test.mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(
          async () =>
            testCase
              .if(condition as any, () => undefined, customTimeoutInSeconds)
              .run(),
          customTimeoutInSeconds
        )
      ).rejects.toEqual(
        new Error(`If conditionDescription\n  Cause: ${customTimeoutMessage}`)
      );

      expect(condition.test).toHaveBeenCalledTimes(1);
    });

    it('should run the <then> sub test case', async () => {
      const condition = new ConditionMock();

      condition.test
        .mockImplementationOnce(erroneous())
        .mockImplementationOnce(async () => true);

      const thenAction = new ActionMock();
      const otherwiseAction = new ActionMock();

      await testCase
        .if(condition as any, (then, otherwise) => {
          then.perform(thenAction);
          otherwise.perform(otherwiseAction);
        })
        .run();

      expect(condition.test).toHaveBeenCalledTimes(2);
      expect(thenAction.perform).toHaveBeenCalledTimes(1);
      expect(otherwiseAction.perform).toHaveBeenCalledTimes(0);
    });

    it('should run the <then> sub test case and throw a default timeout error', async () => {
      const condition = new ConditionMock();

      condition.test.mockImplementationOnce(async () => true);

      const action = new ActionMock();

      action.perform.mockImplementationOnce(neverEnding);

      await expect(
        testCase
          .if(
            condition as any,
            then => then.perform(action),
            customTimeoutInSeconds
          )
          .run()
      ).rejects.toEqual(
        new Error(
          `If conditionDescription\n  Cause: actionDescription\n  Cause: ${defaultTimeoutMessage}`
        )
      );
    });

    it('should run the <otherwise> sub test case', async () => {
      const condition = new ConditionMock();

      condition.test
        .mockImplementationOnce(erroneous())
        .mockImplementationOnce(async () => false);

      const thenAction = new ActionMock();
      const otherwiseAction = new ActionMock();

      await testCase
        .if(condition as any, (then, otherwise) => {
          then.perform(thenAction);
          otherwise.perform(otherwiseAction);
        })
        .run();

      expect(condition.test).toHaveBeenCalledTimes(2);
      expect(thenAction.perform).toHaveBeenCalledTimes(0);
      expect(otherwiseAction.perform).toHaveBeenCalledTimes(1);
    });

    it('should run the <otherwise> sub test case and throw a default timeout error', async () => {
      const condition = new ConditionMock();

      condition.test.mockImplementationOnce(async () => false);

      const action = new ActionMock();

      action.perform.mockImplementationOnce(neverEnding);

      await expect(
        testCase
          .if(
            condition as any,
            (then, otherwise) => otherwise.perform(action),
            customTimeoutInSeconds
          )
          .run()
      ).rejects.toEqual(
        new Error(
          `If conditionDescription\n  Cause: actionDescription\n  Cause: ${defaultTimeoutMessage}`
        )
      );
    });

    it('should not throw an out-of-memory error', async () => {
      const condition = new ConditionMock();

      condition.test.mockImplementation(erroneous());

      await expect(
        testCase.if(condition as any, () => undefined).run()
      ).rejects.toEqual(new Error('If conditionDescription\n  Cause: Error'));
    });
  });

  describe('perform().run()', () => {
    it('should perform the <action>', async () => {
      const action = new ActionMock();

      await testCase.perform(action).run();

      expect(action.perform).toHaveBeenCalledTimes(1);
    });

    it('should throw an <action> error', async () => {
      const action = new ActionMock();

      action.perform.mockImplementationOnce(erroneous());

      await expect(testCase.perform(action).run()).rejects.toEqual(
        new Error('actionDescription\n  Cause: Error')
      );
    });

    it('should throw a default timeout error', async () => {
      const action = new ActionMock();

      action.perform.mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(
          async () => testCase.perform(action).run(),
          defaultTimeoutInSeconds
        )
      ).rejects.toEqual(
        new Error(`actionDescription\n  Cause: ${defaultTimeoutMessage}`)
      );
    });

    it('should throw a custom timeout error', async () => {
      const action = new ActionMock();

      action.perform.mockImplementationOnce(neverEnding);

      await expect(
        observeTimeout(
          async () => testCase.perform(action, customTimeoutInSeconds).run(),
          customTimeoutInSeconds
        )
      ).rejects.toEqual(
        new Error(`actionDescription\n  Cause: ${customTimeoutMessage}`)
      );
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
        calls.push('if()');
      });

      const action = new ActionMock();

      action.perform.mockImplementationOnce(async () => {
        calls.push('perform()');
      });

      await testCase
        .assert(condition as any)
        .if(condition as any, then => then.perform(conditionalAction))
        .perform(action)
        .run();

      expect(calls).toEqual(['assert()', 'if()', 'perform()']);
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
