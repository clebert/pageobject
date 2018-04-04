// tslint:disable no-any

import {FunctionCall, Operation, Operator} from '.';

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

async function useFakeTimers<TResult>(
  executable: () => Promise<TResult>,
  expectedTimeoutInSeconds?: number
): Promise<TResult> {
  jest.useFakeTimers();

  try {
    const execution = new ObservablePromise(executable());

    let actualTimeoutInMilliseconds = 0;

    while (await execution.isPending()) {
      jest.runAllTicks();
      jest.runAllImmediates();
      jest.advanceTimersByTime(1);

      actualTimeoutInMilliseconds += 1;
    }

    if (expectedTimeoutInSeconds !== undefined) {
      expect(actualTimeoutInMilliseconds).toBe(expectedTimeoutInSeconds * 1000);
    }

    return execution.promise;
  } finally {
    jest.useRealTimers();
  }
}

function erroneous(id: number): () => Promise<never> {
  return async () => {
    throw new Error(`Error${id}`);
  };
}

async function fooValue(): Promise<string> {
  return 'foo';
}

async function neverEnding(): Promise<never> {
  return new Promise<never>(() => undefined);
}

const {defaultTimeoutInSeconds} = Operation;

describe('Operation', () => {
  let getterExecutable: jest.Mock;
  let methodExecutable: jest.Mock;

  let getter: FunctionCall<string>;
  let method: FunctionCall<void>;

  beforeEach(() => {
    getterExecutable = jest.fn();
    methodExecutable = jest.fn();

    getter = new FunctionCall(
      {description: 'Object'},
      'getter',
      [],
      getterExecutable
    );

    method = new FunctionCall(
      {description: 'Object'},
      'method',
      [],
      methodExecutable
    );

    Operation.defaultTimeoutInSeconds = 0.01;
  });

  afterEach(() => {
    Operation.defaultTimeoutInSeconds = defaultTimeoutInSeconds;
  });

  it('should have a default timeout', () => {
    expect(defaultTimeoutInSeconds).toBe(5);
  });

  describe('assert() => Operation.execute()', () => {
    it('should return without errors', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementationOnce(fooValue);

      const operation = Operation.assert(getter, Operator.equals('foo'));

      await expect(
        useFakeTimers(async () => operation.execute())
      ).resolves.toEqual([]);

      expect(getterExecutable).toHaveBeenCalledTimes(3);
    });

    it('should throw an assertion error', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementation(fooValue);

      const operation = Operation.assert(getter, Operator.equals('bar'));

      await expect(
        useFakeTimers(async () => operation.execute())
      ).rejects.toThrow(
        "Assert: (getter() == 'bar')\n  Context: Object\n  Cause: Assertion failed: ((getter() => 'foo') == 'bar')"
      );

      expect(getterExecutable.mock.calls.length).toBeGreaterThan(3);
    });

    it('should throw an executable error', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementationOnce(neverEnding);

      const operation = Operation.assert(getter, Operator.equals('foo'));

      await expect(
        useFakeTimers(async () => operation.execute(), 0.01)
      ).rejects.toThrow(
        "Assert: (getter() == 'foo')\n  Context: Object\n  Cause: Error2"
      );

      expect(getterExecutable).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      getterExecutable.mockImplementationOnce(neverEnding);

      const operation = Operation.assert(getter, Operator.equals('foo'));

      await expect(
        useFakeTimers(async () => operation.execute(), 0.01)
      ).rejects.toThrow(
        "Assert: (getter() == 'foo')\n  Context: Object\n  Cause: Timeout after 0.01 seconds"
      );

      expect(getterExecutable).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      getterExecutable.mockImplementationOnce(neverEnding);

      const operation = Operation.assert(getter, Operator.equals('foo'), 1);

      await expect(
        useFakeTimers(async () => operation.execute(), 1)
      ).rejects.toThrow(
        "Assert: (getter() == 'foo')\n  Context: Object\n  Cause: Timeout after 1 second"
      );

      expect(getterExecutable).toHaveBeenCalledTimes(1);
    });
  });

  describe('if() => Operation.execute()', () => {
    it('should return the specified then-operations', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementationOnce(fooValue);

      const thenOperations: Operation[] = [];

      const operation = Operation.if(
        getter,
        Operator.equals('foo'),
        thenOperations
      );

      await expect(
        useFakeTimers(async () => operation.execute())
      ).resolves.toBe(thenOperations);

      expect(getterExecutable).toHaveBeenCalledTimes(3);
    });

    it('should return the default else-operations', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementationOnce(fooValue);

      const thenOperations: Operation[] = [];

      const operation = Operation.if(
        getter,
        Operator.equals('bar'),
        thenOperations
      );

      const elseOperations = await useFakeTimers(async () =>
        operation.execute()
      );

      expect(elseOperations).toEqual([]);
      expect(elseOperations).not.toBe(thenOperations);

      expect(getterExecutable).toHaveBeenCalledTimes(3);
    });

    it('should return the specified else-operations', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementationOnce(fooValue);

      const elseOperations: Operation[] = [];

      const operation = Operation.if(
        getter,
        Operator.equals('bar'),
        [],
        elseOperations
      );

      await expect(
        useFakeTimers(async () => operation.execute())
      ).resolves.toBe(elseOperations);

      expect(getterExecutable).toHaveBeenCalledTimes(3);
    });

    it('should throw an executable error', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementationOnce(neverEnding);

      const operation = Operation.if(getter, Operator.equals('foo'), []);

      await expect(
        useFakeTimers(async () => operation.execute(), 0.01)
      ).rejects.toThrow(
        "If: (getter() == 'foo')\n  Context: Object\n  Cause: Error2"
      );

      expect(getterExecutable).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      getterExecutable.mockImplementationOnce(neverEnding);

      const operation = Operation.if(getter, Operator.equals('foo'), []);

      await expect(
        useFakeTimers(async () => operation.execute(), 0.01)
      ).rejects.toThrow(
        "If: (getter() == 'foo')\n  Context: Object\n  Cause: Timeout after 0.01 seconds"
      );

      expect(getterExecutable).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      getterExecutable.mockImplementationOnce(neverEnding);

      const operation = Operation.if(getter, Operator.equals('foo'), [], [], 1);

      await expect(
        useFakeTimers(async () => operation.execute(), 1)
      ).rejects.toThrow(
        "If: (getter() == 'foo')\n  Context: Object\n  Cause: Timeout after 1 second"
      );

      expect(getterExecutable).toHaveBeenCalledTimes(1);
    });
  });

  describe('perform() => Operation.execute()', () => {
    it('should return without errors', async () => {
      const operation = Operation.perform(method);

      await expect(
        useFakeTimers(async () => operation.execute())
      ).resolves.toEqual([]);

      expect(methodExecutable).toHaveBeenCalledTimes(1);
    });

    it('should throw an executable error', async () => {
      methodExecutable.mockImplementationOnce(erroneous(1));
      methodExecutable.mockImplementationOnce(erroneous(2));

      const operation = Operation.perform(method);

      await expect(
        useFakeTimers(async () => operation.execute())
      ).rejects.toThrow(
        'Perform: method()\n  Context: Object\n  Cause: Error1'
      );

      expect(methodExecutable).toHaveBeenCalledTimes(1);
    });

    it('should throw a default timeout error', async () => {
      methodExecutable.mockImplementationOnce(neverEnding);

      const operation = Operation.perform(method);

      await expect(
        useFakeTimers(async () => operation.execute(), 0.01)
      ).rejects.toThrow(
        'Perform: method()\n  Context: Object\n  Cause: Timeout after 0.01 seconds'
      );

      expect(methodExecutable).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      methodExecutable.mockImplementationOnce(neverEnding);

      const operation = Operation.perform(method, 1);

      await expect(
        useFakeTimers(async () => operation.execute(), 1)
      ).rejects.toThrow(
        'Perform: method()\n  Context: Object\n  Cause: Timeout after 1 second'
      );

      expect(methodExecutable).toHaveBeenCalledTimes(1);
    });
  });

  describe('executeAll()', () => {
    it('should execute all specified operations in sequence', async () => {
      getterExecutable.mockImplementation(fooValue);

      const calls: number[] = [];

      await Operation.executeAll([
        Operation.assert(
          {
            ...getter,
            executable: async () => {
              calls.push(1);

              return getter.executable();
            }
          },
          Operator.equals('foo')
        ),
        Operation.if(getter, Operator.equals('foo'), [
          Operation.assert(
            {
              ...getter,
              executable: async () => {
                calls.push(2);

                return getter.executable();
              }
            },
            Operator.equals('foo')
          ),
          Operation.if(getter, Operator.equals('foo'), [
            Operation.perform({
              ...method,
              executable: async () => {
                calls.push(3);
              }
            })
          ])
        ]),
        Operation.perform({
          ...method,
          executable: async () => {
            calls.push(4);
          }
        })
      ]);

      expect(calls).toEqual([1, 2, 3, 4]);
    });
  });
});
