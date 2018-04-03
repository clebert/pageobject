// tslint:disable no-any

import {Effect, Instruction, Operator} from '.';

class TestEffect implements Effect<any> {
  public readonly context = {description: 'Object'};
  public readonly description = 'effect()';
  public readonly trigger = jest.fn();
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
    throw new Error(`EffectError${id}`);
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
  let effect: TestEffect;

  beforeEach(() => {
    effect = new TestEffect();

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
      effect.trigger.mockImplementationOnce(erroneous(1));
      effect.trigger.mockImplementationOnce(erroneous(2));
      effect.trigger.mockImplementationOnce(fooValue);

      const instruction = Instruction.assert(effect, Operator.equals('foo'));

      await expect(
        useFakeTimers(async () => instruction.execute())
      ).resolves.toEqual([]);

      expect(effect.trigger).toHaveBeenCalledTimes(3);
    });

    it('should throw an assertion error', async () => {
      effect.trigger.mockImplementationOnce(erroneous(1));
      effect.trigger.mockImplementationOnce(erroneous(2));
      effect.trigger.mockImplementation(fooValue);

      const instruction = Instruction.assert(effect, Operator.equals('bar'));

      await expect(
        useFakeTimers(async () => instruction.execute())
      ).rejects.toThrow(
        "Assert: (effect() == 'bar')\n  Context: Object\n  Cause: Assertion failed: ((effect() => 'foo') == 'bar')"
      );

      expect(effect.trigger.mock.calls.length).toBeGreaterThan(3);
    });

    it('should throw an effect error', async () => {
      effect.trigger.mockImplementationOnce(erroneous(1));
      effect.trigger.mockImplementationOnce(erroneous(2));
      effect.trigger.mockImplementationOnce(neverEnding);

      const instruction = Instruction.assert(effect, Operator.equals('foo'));

      await expect(
        useFakeTimers(async () => instruction.execute(), 0.01)
      ).rejects.toThrow(
        "Assert: (effect() == 'foo')\n  Context: Object\n  Cause: EffectError2"
      );

      expect(effect.trigger).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      effect.trigger.mockImplementationOnce(neverEnding);

      const instruction = Instruction.assert(effect, Operator.equals('foo'));

      await expect(
        useFakeTimers(async () => instruction.execute(), 0.01)
      ).rejects.toThrow(
        "Assert: (effect() == 'foo')\n  Context: Object\n  Cause: Timeout after 0.01 seconds"
      );

      expect(effect.trigger).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      effect.trigger.mockImplementationOnce(neverEnding);

      const instruction = Instruction.assert(effect, Operator.equals('foo'), 1);

      await expect(
        useFakeTimers(async () => instruction.execute(), 1)
      ).rejects.toThrow(
        "Assert: (effect() == 'foo')\n  Context: Object\n  Cause: Timeout after 1 second"
      );

      expect(effect.trigger).toHaveBeenCalledTimes(1);
    });
  });

  describe('if() => Instruction.execute()', () => {
    it('should return the specified then-instructions', async () => {
      effect.trigger.mockImplementationOnce(erroneous(1));
      effect.trigger.mockImplementationOnce(erroneous(2));
      effect.trigger.mockImplementationOnce(fooValue);

      const thenInstructions: Instruction[] = [];

      const instruction = Instruction.if(
        effect,
        Operator.equals('foo'),
        thenInstructions
      );

      await expect(
        useFakeTimers(async () => instruction.execute())
      ).resolves.toBe(thenInstructions);

      expect(effect.trigger).toHaveBeenCalledTimes(3);
    });

    it('should return the default else-instructions', async () => {
      effect.trigger.mockImplementationOnce(erroneous(1));
      effect.trigger.mockImplementationOnce(erroneous(2));
      effect.trigger.mockImplementationOnce(fooValue);

      const thenInstructions: Instruction[] = [];

      const instruction = Instruction.if(
        effect,
        Operator.equals('bar'),
        thenInstructions
      );

      const elseInstructions = await useFakeTimers(async () =>
        instruction.execute()
      );

      expect(elseInstructions).toEqual([]);
      expect(elseInstructions).not.toBe(thenInstructions);

      expect(effect.trigger).toHaveBeenCalledTimes(3);
    });

    it('should return the specified else-instructions', async () => {
      effect.trigger.mockImplementationOnce(erroneous(1));
      effect.trigger.mockImplementationOnce(erroneous(2));
      effect.trigger.mockImplementationOnce(fooValue);

      const elseInstructions: Instruction[] = [];

      const instruction = Instruction.if(
        effect,
        Operator.equals('bar'),
        [],
        elseInstructions
      );

      await expect(
        useFakeTimers(async () => instruction.execute())
      ).resolves.toBe(elseInstructions);

      expect(effect.trigger).toHaveBeenCalledTimes(3);
    });

    it('should throw an effect error', async () => {
      effect.trigger.mockImplementationOnce(erroneous(1));
      effect.trigger.mockImplementationOnce(erroneous(2));
      effect.trigger.mockImplementationOnce(neverEnding);

      const instruction = Instruction.if(effect, Operator.equals('foo'), []);

      await expect(
        useFakeTimers(async () => instruction.execute(), 0.01)
      ).rejects.toThrow(
        "If: (effect() == 'foo')\n  Context: Object\n  Cause: EffectError2"
      );

      expect(effect.trigger).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      effect.trigger.mockImplementationOnce(neverEnding);

      const instruction = Instruction.if(effect, Operator.equals('foo'), []);

      await expect(
        useFakeTimers(async () => instruction.execute(), 0.01)
      ).rejects.toThrow(
        "If: (effect() == 'foo')\n  Context: Object\n  Cause: Timeout after 0.01 seconds"
      );

      expect(effect.trigger).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      effect.trigger.mockImplementationOnce(neverEnding);

      const instruction = Instruction.if(
        effect,
        Operator.equals('foo'),
        [],
        [],
        1
      );

      await expect(
        useFakeTimers(async () => instruction.execute(), 1)
      ).rejects.toThrow(
        "If: (effect() == 'foo')\n  Context: Object\n  Cause: Timeout after 1 second"
      );

      expect(effect.trigger).toHaveBeenCalledTimes(1);
    });
  });

  describe('perform() => Instruction.execute()', () => {
    it('should return without errors', async () => {
      const instruction = Instruction.perform(effect);

      await expect(
        useFakeTimers(async () => instruction.execute())
      ).resolves.toEqual([]);

      expect(effect.trigger).toHaveBeenCalledTimes(1);
    });

    it('should throw an effect error', async () => {
      effect.trigger.mockImplementationOnce(erroneous(1));
      effect.trigger.mockImplementationOnce(erroneous(2));

      const instruction = Instruction.perform(effect);

      await expect(
        useFakeTimers(async () => instruction.execute())
      ).rejects.toThrow(
        'Perform: effect()\n  Context: Object\n  Cause: EffectError1'
      );

      expect(effect.trigger).toHaveBeenCalledTimes(1);
    });

    it('should throw a default timeout error', async () => {
      effect.trigger.mockImplementationOnce(neverEnding);

      const instruction = Instruction.perform(effect);

      await expect(
        useFakeTimers(async () => instruction.execute(), 0.01)
      ).rejects.toThrow(
        'Perform: effect()\n  Context: Object\n  Cause: Timeout after 0.01 seconds'
      );

      expect(effect.trigger).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      effect.trigger.mockImplementationOnce(neverEnding);

      const instruction = Instruction.perform(effect, 1);

      await expect(
        useFakeTimers(async () => instruction.execute(), 1)
      ).rejects.toThrow(
        'Perform: effect()\n  Context: Object\n  Cause: Timeout after 1 second'
      );

      expect(effect.trigger).toHaveBeenCalledTimes(1);
    });
  });

  describe('executeAll()', () => {
    it('should execute all specified instructions in sequence', async () => {
      effect.trigger.mockImplementation(fooValue);

      const calls: number[] = [];

      await Instruction.executeAll([
        Instruction.assert(
          {
            ...effect,
            trigger: async () => {
              calls.push(1);

              return effect.trigger();
            }
          },
          Operator.equals('foo')
        ),
        Instruction.if(effect, Operator.equals('foo'), [
          Instruction.assert(
            {
              ...effect,
              trigger: async () => {
                calls.push(2);

                return effect.trigger();
              }
            },
            Operator.equals('foo')
          ),
          Instruction.if(effect, Operator.equals('foo'), [
            Instruction.perform({
              ...effect,
              trigger: async () => {
                calls.push(3);

                return effect.trigger();
              }
            })
          ])
        ]),
        Instruction.perform({
          ...effect,
          trigger: async () => {
            calls.push(4);

            return effect.trigger();
          }
        })
      ]);

      expect(calls).toEqual([1, 2, 3, 4]);
    });
  });
});
