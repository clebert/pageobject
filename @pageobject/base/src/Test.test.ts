import {Adapter, Effect, Predicate, Test} from '.';

const {is} = Predicate;

class TestAdapter implements Adapter<object> {
  public readonly findNodes = jest.fn();
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
    for (let i = 0; i < 25; i += 1) {
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
    throw new Error(`effect ${id}`);
  };
}

async function fooValue(): Promise<string> {
  return 'foo';
}

async function neverEnding(): Promise<never> {
  return new Promise<never>(() => undefined);
}

const adapter = new TestAdapter();
const defaultTimeoutInSeconds = 0.01;

describe('Test.run()', () => {
  let effect: jest.Mock;

  beforeEach(() => {
    effect = jest.fn();
  });

  it('should run all test steps in sequence', async () => {
    const calls: number[] = [];

    const fooEffect = (call: number) => async () => {
      calls.push(call);

      return 'foo';
    };

    const voidEffect = (call: number) => async () => {
      calls.push(call);
    };

    await useFakeTimers(async () =>
      Test.run(adapter, defaultTimeoutInSeconds, test =>
        test
          .assert(fooEffect(1), is('foo'))
          .if(fooEffect(2), is('foo'), thenTest1 =>
            thenTest1
              .assert(fooEffect(3), is('foo'))
              .if(fooEffect(4), is('foo'), thenTest2 =>
                thenTest2.perform(voidEffect(5))
              )
          )
          .perform(voidEffect(6))
      )
    );

    expect(calls).toEqual([1, 2, 3, 4, 5, 6]);
  });

  describe('Test.adapter', () => {
    it('should be the specified adapter', async () => {
      expect.assertions(1);

      await Test.run(adapter, defaultTimeoutInSeconds, test => {
        expect(test.adapter).toBe(adapter);
      });
    });
  });

  describe('Test.assert()', () => {
    it('should not throw an error', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementationOnce(fooValue);

      await useFakeTimers(async () =>
        Test.run(adapter, defaultTimeoutInSeconds, test => {
          test.assert(effect, is('foo'));
        })
      );

      expect(effect).toHaveBeenCalledTimes(3);
    });

    it('should throw an assertion error', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementation(fooValue);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(adapter, defaultTimeoutInSeconds, test => {
              test.assert(effect, is('bar'));
            }),
          defaultTimeoutInSeconds
        )
      ).rejects.toThrow('Expected value to be:');

      expect(effect.mock.calls.length).toBeGreaterThan(3);
    });

    it('should throw an effect error', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(adapter, defaultTimeoutInSeconds, test => {
              test.assert(effect, is('foo'));
            }),
          defaultTimeoutInSeconds
        )
      ).rejects.toThrow('effect 2');

      expect(effect).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(adapter, defaultTimeoutInSeconds, test => {
              test.assert(effect, is('foo'));
            }),
          defaultTimeoutInSeconds
        )
      ).rejects.toThrow('Timeout after 0.01 seconds');

      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(adapter, defaultTimeoutInSeconds, test => {
              test.assert(effect, is('foo'), 1);
            }),
          1
        )
      ).rejects.toThrow('Timeout after 1 second');

      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test.if()', () => {
    it('should call the callback with proper arguments', async () => {
      expect.assertions(8);

      await useFakeTimers(async () =>
        Test.run(adapter, defaultTimeoutInSeconds, test => {
          test.if(effect, is('foo'), (thenTest, elseTest) => {
            expect(thenTest).not.toBe(test);
            expect(elseTest).not.toBe(test);

            expect(thenTest).toBeInstanceOf(Test);
            expect(elseTest).toBeInstanceOf(Test);

            expect(thenTest.adapter).toBe(test.adapter);
            expect(elseTest.adapter).toBe(test.adapter);

            expect(thenTest.defaultTimeoutInSeconds).toBe(
              test.defaultTimeoutInSeconds
            );

            expect(elseTest.defaultTimeoutInSeconds).toBe(
              test.defaultTimeoutInSeconds
            );
          });
        })
      );
    });

    it('should run the then-test without error', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementationOnce(fooValue);

      const noEffect = jest.fn();

      await useFakeTimers(async () =>
        Test.run(adapter, defaultTimeoutInSeconds, test => {
          test.if(effect, is('foo'), (thenTest, elseTest) => {
            thenTest.perform(effect);

            elseTest.perform(noEffect);
          });
        })
      );

      expect(effect).toHaveBeenCalledTimes(4);
    });

    it('should run the else-test without error', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementationOnce(fooValue);

      const noEffect = jest.fn();

      await useFakeTimers(async () =>
        Test.run(adapter, defaultTimeoutInSeconds, test => {
          test.if(effect, is('bar'), (thenTest, elseTest) => {
            thenTest.perform(noEffect);

            elseTest.perform(effect);
          });
        })
      );

      expect(effect).toHaveBeenCalledTimes(4);
    });

    it('should throw an effect error', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));
      effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(adapter, defaultTimeoutInSeconds, test => {
              test.if(effect, is('foo'), () => undefined);
            }),
          defaultTimeoutInSeconds
        )
      ).rejects.toThrow('effect 2');

      expect(effect).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(adapter, defaultTimeoutInSeconds, test => {
              test.if(effect, is('foo'), () => undefined);
            }),
          defaultTimeoutInSeconds
        )
      ).rejects.toThrow('Timeout after 0.01 seconds');

      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(adapter, defaultTimeoutInSeconds, test => {
              test.if(effect, is('foo'), () => undefined, 1);
            }),
          1
        )
      ).rejects.toThrow('Timeout after 1 second');

      expect(effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test.perform()', () => {
    it('should not throw an error', async () => {
      await useFakeTimers(async () =>
        Test.run(adapter, defaultTimeoutInSeconds, test => {
          test.perform(effect);
        })
      );

      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should throw an effect error', async () => {
      effect.mockImplementationOnce(erroneous(1));
      effect.mockImplementationOnce(erroneous(2));

      await expect(
        useFakeTimers(async () =>
          Test.run(adapter, defaultTimeoutInSeconds, test => {
            test.perform(effect);
          })
        )
      ).rejects.toThrow('effect 1');

      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should throw a default timeout error', async () => {
      effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(adapter, defaultTimeoutInSeconds, test => {
              test.perform(effect);
            }),
          defaultTimeoutInSeconds
        )
      ).rejects.toThrow('Timeout after 0.01 seconds');

      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(adapter, defaultTimeoutInSeconds, test => {
              test.perform(effect, 1);
            }),
          1
        )
      ).rejects.toThrow('Timeout after 1 second');

      expect(effect).toHaveBeenCalledTimes(1);
    });
  });
});
