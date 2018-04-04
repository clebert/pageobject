// tslint:disable no-any

import {FunctionCall, Instruction, Operator} from '.';

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

const {defaultTimeoutInSeconds} = Instruction;

describe('Instruction', () => {
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

    Instruction.defaultTimeoutInSeconds = 0.01;
  });

  afterEach(() => {
    Instruction.defaultTimeoutInSeconds = defaultTimeoutInSeconds;
  });

  it('should have a default timeout', () => {
    expect(defaultTimeoutInSeconds).toBe(5);
  });

  describe('assert() => Instruction.execute()', () => {
    it('should return without errors', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementationOnce(fooValue);

      const instruction = Instruction.assert(getter, Operator.equals('foo'));

      await expect(
        useFakeTimers(async () => instruction.execute())
      ).resolves.toEqual([]);

      expect(getterExecutable).toHaveBeenCalledTimes(3);
    });

    it('should throw an assertion error', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementation(fooValue);

      const instruction = Instruction.assert(getter, Operator.equals('bar'));

      await expect(
        useFakeTimers(async () => instruction.execute())
      ).rejects.toThrow(
        "Assert: (getter() == 'bar')\n  Context: Object\n  Cause: Assertion failed: ((getter() => 'foo') == 'bar')"
      );

      expect(getterExecutable.mock.calls.length).toBeGreaterThan(3);
    });

    it('should throw an executable error', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementationOnce(neverEnding);

      const instruction = Instruction.assert(getter, Operator.equals('foo'));

      await expect(
        useFakeTimers(async () => instruction.execute(), 0.01)
      ).rejects.toThrow(
        "Assert: (getter() == 'foo')\n  Context: Object\n  Cause: Error2"
      );

      expect(getterExecutable).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      getterExecutable.mockImplementationOnce(neverEnding);

      const instruction = Instruction.assert(getter, Operator.equals('foo'));

      await expect(
        useFakeTimers(async () => instruction.execute(), 0.01)
      ).rejects.toThrow(
        "Assert: (getter() == 'foo')\n  Context: Object\n  Cause: Timeout after 0.01 seconds"
      );

      expect(getterExecutable).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      getterExecutable.mockImplementationOnce(neverEnding);

      const instruction = Instruction.assert(getter, Operator.equals('foo'), 1);

      await expect(
        useFakeTimers(async () => instruction.execute(), 1)
      ).rejects.toThrow(
        "Assert: (getter() == 'foo')\n  Context: Object\n  Cause: Timeout after 1 second"
      );

      expect(getterExecutable).toHaveBeenCalledTimes(1);
    });
  });

  describe('if() => Instruction.execute()', () => {
    it('should return the specified then-instructions', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementationOnce(fooValue);

      const thenInstructions: Instruction[] = [];

      const instruction = Instruction.if(
        getter,
        Operator.equals('foo'),
        thenInstructions
      );

      await expect(
        useFakeTimers(async () => instruction.execute())
      ).resolves.toBe(thenInstructions);

      expect(getterExecutable).toHaveBeenCalledTimes(3);
    });

    it('should return the default else-instructions', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementationOnce(fooValue);

      const thenInstructions: Instruction[] = [];

      const instruction = Instruction.if(
        getter,
        Operator.equals('bar'),
        thenInstructions
      );

      const elseInstructions = await useFakeTimers(async () =>
        instruction.execute()
      );

      expect(elseInstructions).toEqual([]);
      expect(elseInstructions).not.toBe(thenInstructions);

      expect(getterExecutable).toHaveBeenCalledTimes(3);
    });

    it('should return the specified else-instructions', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementationOnce(fooValue);

      const elseInstructions: Instruction[] = [];

      const instruction = Instruction.if(
        getter,
        Operator.equals('bar'),
        [],
        elseInstructions
      );

      await expect(
        useFakeTimers(async () => instruction.execute())
      ).resolves.toBe(elseInstructions);

      expect(getterExecutable).toHaveBeenCalledTimes(3);
    });

    it('should throw an executable error', async () => {
      getterExecutable.mockImplementationOnce(erroneous(1));
      getterExecutable.mockImplementationOnce(erroneous(2));
      getterExecutable.mockImplementationOnce(neverEnding);

      const instruction = Instruction.if(getter, Operator.equals('foo'), []);

      await expect(
        useFakeTimers(async () => instruction.execute(), 0.01)
      ).rejects.toThrow(
        "If: (getter() == 'foo')\n  Context: Object\n  Cause: Error2"
      );

      expect(getterExecutable).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      getterExecutable.mockImplementationOnce(neverEnding);

      const instruction = Instruction.if(getter, Operator.equals('foo'), []);

      await expect(
        useFakeTimers(async () => instruction.execute(), 0.01)
      ).rejects.toThrow(
        "If: (getter() == 'foo')\n  Context: Object\n  Cause: Timeout after 0.01 seconds"
      );

      expect(getterExecutable).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      getterExecutable.mockImplementationOnce(neverEnding);

      const instruction = Instruction.if(
        getter,
        Operator.equals('foo'),
        [],
        [],
        1
      );

      await expect(
        useFakeTimers(async () => instruction.execute(), 1)
      ).rejects.toThrow(
        "If: (getter() == 'foo')\n  Context: Object\n  Cause: Timeout after 1 second"
      );

      expect(getterExecutable).toHaveBeenCalledTimes(1);
    });
  });

  describe('perform() => Instruction.execute()', () => {
    it('should return without errors', async () => {
      const instruction = Instruction.perform(method);

      await expect(
        useFakeTimers(async () => instruction.execute())
      ).resolves.toEqual([]);

      expect(methodExecutable).toHaveBeenCalledTimes(1);
    });

    it('should throw an executable error', async () => {
      methodExecutable.mockImplementationOnce(erroneous(1));
      methodExecutable.mockImplementationOnce(erroneous(2));

      const instruction = Instruction.perform(method);

      await expect(
        useFakeTimers(async () => instruction.execute())
      ).rejects.toThrow(
        'Perform: method()\n  Context: Object\n  Cause: Error1'
      );

      expect(methodExecutable).toHaveBeenCalledTimes(1);
    });

    it('should throw a default timeout error', async () => {
      methodExecutable.mockImplementationOnce(neverEnding);

      const instruction = Instruction.perform(method);

      await expect(
        useFakeTimers(async () => instruction.execute(), 0.01)
      ).rejects.toThrow(
        'Perform: method()\n  Context: Object\n  Cause: Timeout after 0.01 seconds'
      );

      expect(methodExecutable).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      methodExecutable.mockImplementationOnce(neverEnding);

      const instruction = Instruction.perform(method, 1);

      await expect(
        useFakeTimers(async () => instruction.execute(), 1)
      ).rejects.toThrow(
        'Perform: method()\n  Context: Object\n  Cause: Timeout after 1 second'
      );

      expect(methodExecutable).toHaveBeenCalledTimes(1);
    });
  });

  describe('executeAll()', () => {
    it('should execute all specified instructions in sequence', async () => {
      getterExecutable.mockImplementation(fooValue);

      const calls: number[] = [];

      await Instruction.executeAll([
        Instruction.assert(
          {
            ...getter,
            executable: async () => {
              calls.push(1);

              return getter.executable();
            }
          },
          Operator.equals('foo')
        ),
        Instruction.if(getter, Operator.equals('foo'), [
          Instruction.assert(
            {
              ...getter,
              executable: async () => {
                calls.push(2);

                return getter.executable();
              }
            },
            Operator.equals('foo')
          ),
          Instruction.if(getter, Operator.equals('foo'), [
            Instruction.perform({
              ...method,
              executable: async () => {
                calls.push(3);
              }
            })
          ])
        ]),
        Instruction.perform({
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
