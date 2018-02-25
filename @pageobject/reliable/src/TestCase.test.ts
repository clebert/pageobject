/* tslint:disable no-any */

import {TestCase} from '.';

class ConditionMock {
  public readonly assert = jest.fn();
  public readonly test = jest.fn();
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
  value: number
): Promise<void> {
  jest.useFakeTimers();

  try {
    const execution = new ObservablePromise(executable());

    for (let i = 0; i < value; i += 1) {
      jest.runAllTicks();
      jest.runAllImmediates();
      jest.advanceTimersByTime(1);

      if ((await execution.isPending()) !== i + 1 < value) {
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
    testCase = new TestCase(100);
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
        .mockImplementation(neverEnding);

      await expect(
        observeTimeout(async () => testCase.assert(condition as any).run(), 100)
      ).rejects.toEqual(new Error('Error 2'));

      expect(condition.assert).toHaveBeenCalledTimes(3);
    });

    it('should throw an assertion-timeout error', async () => {
      const condition = new ConditionMock();

      condition.assert.mockImplementation(neverEnding);

      await expect(
        observeTimeout(async () => testCase.assert(condition as any).run(), 100)
      ).rejects.toEqual(new Error('Assertion timeout after 100 milliseconds'));

      expect(condition.assert).toHaveBeenCalledTimes(1);
    });

    it('should not throw an out-of-memory error', async () => {
      const condition = new ConditionMock();

      condition.assert.mockImplementation(erroneous());

      await expect(testCase.assert(condition as any).run()).rejects.toEqual(
        new Error('Error')
      );
    });
  });

  describe('perform().run()', () => {
    it('should perform the specified action', async () => {
      const action = jest.fn();

      await testCase.perform(action).run();

      expect(action).toHaveBeenCalledTimes(1);
      expect(action).toHaveBeenCalledWith();
    });

    it('should throw an action error', async () => {
      const action = jest.fn();

      action.mockImplementationOnce(erroneous());

      await expect(testCase.perform(action).run()).rejects.toEqual(
        new Error('Error')
      );
    });
  });

  describe('run()', async () => {
    it('should run the test steps sequentially', async () => {
      const calls: string[] = [];

      const condition = new ConditionMock();

      condition.assert.mockImplementation(async () => {
        calls.push('assert()');
      });

      const action = jest.fn();

      action.mockImplementation(async () => {
        calls.push('perform()');
      });

      await testCase
        .assert(condition as any)
        .perform(action)
        .run();

      expect(calls).toEqual(['assert()', 'perform()']);
    });
  });
});
