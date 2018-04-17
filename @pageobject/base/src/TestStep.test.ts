import {Effect, Predicate, TestStep} from '.';

const {is} = Predicate;

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
  effect: Effect<TResult>,
  expectedTimeoutInSeconds?: number
): Promise<TResult> {
  jest.useFakeTimers();

  try {
    const result = new ObservablePromise(effect());

    let actualTimeoutInMilliseconds = 0;

    while (await result.isPending()) {
      jest.runAllTicks();
      jest.runAllImmediates();
      jest.advanceTimersByTime(1);

      actualTimeoutInMilliseconds += 1;
    }

    if (expectedTimeoutInSeconds !== undefined) {
      expect(actualTimeoutInMilliseconds).toBe(expectedTimeoutInSeconds * 1000);
    }

    return result.promise;
  } finally {
    jest.useRealTimers();
  }
}

function erroneous(id: number): () => Promise<never> {
  return async () => {
    throw new Error(`effect${id}`);
  };
}

async function fooValue(): Promise<string> {
  return 'foo';
}

async function neverEnding(): Promise<never> {
  return new Promise<never>(() => undefined);
}

const {defaultTimeoutInSeconds} = TestStep;

describe('TestStep', () => {
  let effect: jest.Mock;

  beforeEach(() => {
    effect = jest.fn();

    TestStep.defaultTimeoutInSeconds = 0.01;
  });

  afterEach(() => {
    TestStep.defaultTimeoutInSeconds = defaultTimeoutInSeconds;
  });

  it('should have a default timeout', () => {
    expect(defaultTimeoutInSeconds).toBe(5);
  });

  describe('assert() => TestStep.run()', () => {
    it('should return no sub-test steps', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementationOnce(fooValue);

      const testStep = TestStep.assert(effect, is('foo'));

      await expect(useFakeTimers(async () => testStep.run())).resolves.toEqual(
        []
      );

      expect(effect).toHaveBeenCalledTimes(3);
    });

    it('should throw an assertion error', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementation(fooValue);

      const testStep = TestStep.assert(effect, is('bar'));

      await expect(useFakeTimers(async () => testStep.run())).rejects.toThrow(
        'Expected value to be:'
      );

      expect(effect.mock.calls.length).toBeGreaterThan(3);
    });

    it('should throw an effect error', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementationOnce(neverEnding);

      const testStep = TestStep.assert(effect, is('foo'));

      await expect(
        useFakeTimers(async () => testStep.run(), 0.01)
      ).rejects.toThrow('effect2');

      expect(effect).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      effect.mockImplementationOnce(neverEnding);

      const testStep = TestStep.assert(effect, is('foo'));

      await expect(
        useFakeTimers(async () => testStep.run(), 0.01)
      ).rejects.toThrow('Timeout after 0.01 seconds');

      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      effect.mockImplementationOnce(neverEnding);

      const testStep = TestStep.assert(effect, is('foo'), 1);

      await expect(
        useFakeTimers(async () => testStep.run(), 1)
      ).rejects.toThrow('Timeout after 1 second');

      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('if() => TestStep.run()', () => {
    it('should return the specified then-test steps', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementationOnce(fooValue);

      const thenTestSteps: TestStep[] = [];

      const testStep = TestStep.if(effect, is('foo'), thenTestSteps);

      await expect(useFakeTimers(async () => testStep.run())).resolves.toBe(
        thenTestSteps
      );

      expect(effect).toHaveBeenCalledTimes(3);
    });

    it('should return the default else-test steps', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementationOnce(fooValue);

      const thenTestSteps: TestStep[] = [];

      const testStep = TestStep.if(effect, is('bar'), thenTestSteps);

      const elseTestSteps = await useFakeTimers(async () => testStep.run());

      expect(elseTestSteps).toEqual([]);
      expect(elseTestSteps).not.toBe(thenTestSteps);

      expect(effect).toHaveBeenCalledTimes(3);
    });

    it('should return the specified else-test steps', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementationOnce(fooValue);

      const elseTestSteps: TestStep[] = [];

      const testStep = TestStep.if(effect, is('bar'), [], elseTestSteps);

      await expect(useFakeTimers(async () => testStep.run())).resolves.toBe(
        elseTestSteps
      );

      expect(effect).toHaveBeenCalledTimes(3);
    });

    it('should throw an effect error', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementationOnce(neverEnding);

      const testStep = TestStep.if(effect, is('foo'), []);

      await expect(
        useFakeTimers(async () => testStep.run(), 0.01)
      ).rejects.toThrow('effect2');

      expect(effect).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      effect.mockImplementationOnce(neverEnding);

      const testStep = TestStep.if(effect, is('foo'), []);

      await expect(
        useFakeTimers(async () => testStep.run(), 0.01)
      ).rejects.toThrow('Timeout after 0.01 seconds');

      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      effect.mockImplementationOnce(neverEnding);

      const testStep = TestStep.if(effect, is('foo'), [], [], 1);

      await expect(
        useFakeTimers(async () => testStep.run(), 1)
      ).rejects.toThrow('Timeout after 1 second');

      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('perform() => TestStep.run()', () => {
    it('should return no sub-test steps', async () => {
      const testStep = TestStep.perform(effect);

      await expect(useFakeTimers(async () => testStep.run())).resolves.toEqual(
        []
      );

      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should throw an effect error', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));

      const testStep = TestStep.perform(effect);

      await expect(useFakeTimers(async () => testStep.run())).rejects.toThrow(
        'effect1'
      );

      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should throw a default timeout error', async () => {
      effect.mockImplementationOnce(neverEnding);

      const testStep = TestStep.perform(effect);

      await expect(
        useFakeTimers(async () => testStep.run(), 0.01)
      ).rejects.toThrow('Timeout after 0.01 seconds');

      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      effect.mockImplementationOnce(neverEnding);

      const testStep = TestStep.perform(effect, 1);

      await expect(
        useFakeTimers(async () => testStep.run(), 1)
      ).rejects.toThrow('Timeout after 1 second');

      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('runAll()', () => {
    it('should run all specified test steps in sequence', async () => {
      const calls: number[] = [];

      const fooEffect = (call: number) => async () => {
        calls.push(call);

        return 'foo';
      };

      const voidEffect = (call: number) => async () => {
        calls.push(call);
      };

      await TestStep.runAll([
        TestStep.assert(fooEffect(1), is('foo')),
        TestStep.if(fooEffect(2), is('foo'), [
          TestStep.assert(fooEffect(3), is('foo')),
          TestStep.if(fooEffect(4), is('foo'), [
            TestStep.perform(voidEffect(5))
          ])
        ]),
        TestStep.perform(voidEffect(6))
      ]);

      expect(calls).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });
});
