import {Effect, Predicate, Test} from '.';

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

const defaultTimeoutInSeconds = 0.01;

describe('Test.run()', () => {
  let ctx: {effect: jest.Mock};

  beforeEach(() => {
    ctx = {effect: jest.fn()};
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
      Test.run(ctx, defaultTimeoutInSeconds, test =>
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

  describe('Test.assert()', () => {
    it('should not throw an error', async () => {
      ctx.effect.mockImplementationOnce(erroneous(1));
      ctx.effect.mockImplementationOnce(erroneous(2));
      ctx.effect.mockImplementationOnce(fooValue);

      await useFakeTimers(async () =>
        Test.run(ctx, defaultTimeoutInSeconds, test => {
          test.assert(test.ctx.effect, is('foo'));
        })
      );

      expect(ctx.effect).toHaveBeenCalledTimes(3);
    });

    it('should throw an assertion error', async () => {
      ctx.effect.mockImplementationOnce(erroneous(1));
      ctx.effect.mockImplementationOnce(erroneous(2));
      ctx.effect.mockImplementation(fooValue);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(ctx, defaultTimeoutInSeconds, test => {
              test.assert(test.ctx.effect, is('bar'));
            }),
          defaultTimeoutInSeconds
        )
      ).rejects.toThrow('Expected value to be:');

      expect(ctx.effect.mock.calls.length).toBeGreaterThan(3);
    });

    it('should throw an effect error', async () => {
      ctx.effect.mockImplementationOnce(erroneous(1));
      ctx.effect.mockImplementationOnce(erroneous(2));
      ctx.effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(ctx, defaultTimeoutInSeconds, test => {
              test.assert(test.ctx.effect, is('foo'));
            }),
          defaultTimeoutInSeconds
        )
      ).rejects.toThrow('effect 2');

      expect(ctx.effect).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      ctx.effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(ctx, defaultTimeoutInSeconds, test => {
              test.assert(test.ctx.effect, is('foo'));
            }),
          defaultTimeoutInSeconds
        )
      ).rejects.toThrow('Timeout after 0.01 seconds');

      expect(ctx.effect).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      ctx.effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(ctx, defaultTimeoutInSeconds, test => {
              test.assert(test.ctx.effect, is('foo'), 1);
            }),
          1
        )
      ).rejects.toThrow('Timeout after 1 second');

      expect(ctx.effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test.if()', () => {
    it('should call the callback with proper arguments', async () => {
      expect.assertions(8);

      await useFakeTimers(async () =>
        Test.run(ctx, defaultTimeoutInSeconds, test => {
          test.if(test.ctx.effect, is('foo'), (thenTest, elseTest) => {
            expect(thenTest).not.toBe(test);
            expect(elseTest).not.toBe(test);

            expect(thenTest).toBeInstanceOf(Test);
            expect(elseTest).toBeInstanceOf(Test);

            expect(thenTest.ctx).toBe(test.ctx);
            expect(elseTest.ctx).toBe(test.ctx);

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
      ctx.effect.mockImplementationOnce(erroneous(1));
      ctx.effect.mockImplementationOnce(erroneous(2));
      ctx.effect.mockImplementationOnce(fooValue);

      const noEffect = jest.fn();

      await useFakeTimers(async () =>
        Test.run(ctx, defaultTimeoutInSeconds, test => {
          test.if(test.ctx.effect, is('foo'), (thenTest, elseTest) => {
            thenTest.perform(thenTest.ctx.effect);

            elseTest.perform(noEffect);
          });
        })
      );

      expect(ctx.effect).toHaveBeenCalledTimes(4);
    });

    it('should run the else-test without error', async () => {
      ctx.effect.mockImplementationOnce(erroneous(1));
      ctx.effect.mockImplementationOnce(erroneous(2));
      ctx.effect.mockImplementationOnce(fooValue);

      const noEffect = jest.fn();

      await useFakeTimers(async () =>
        Test.run(ctx, defaultTimeoutInSeconds, test => {
          test.if(test.ctx.effect, is('bar'), (thenTest, elseTest) => {
            thenTest.perform(noEffect);

            elseTest.perform(thenTest.ctx.effect);
          });
        })
      );

      expect(ctx.effect).toHaveBeenCalledTimes(4);
    });

    it('should throw an effect error', async () => {
      ctx.effect.mockImplementationOnce(erroneous(1));
      ctx.effect.mockImplementationOnce(erroneous(2));
      ctx.effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(ctx, defaultTimeoutInSeconds, test => {
              test.if(test.ctx.effect, is('foo'), () => undefined);
            }),
          defaultTimeoutInSeconds
        )
      ).rejects.toThrow('effect 2');

      expect(ctx.effect).toHaveBeenCalledTimes(3);
    });

    it('should throw a default timeout error', async () => {
      ctx.effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(ctx, defaultTimeoutInSeconds, test => {
              test.if(test.ctx.effect, is('foo'), () => undefined);
            }),
          defaultTimeoutInSeconds
        )
      ).rejects.toThrow('Timeout after 0.01 seconds');

      expect(ctx.effect).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      ctx.effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(ctx, defaultTimeoutInSeconds, test => {
              test.if(test.ctx.effect, is('foo'), () => undefined, 1);
            }),
          1
        )
      ).rejects.toThrow('Timeout after 1 second');

      expect(ctx.effect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Test.perform()', () => {
    it('should not throw an error', async () => {
      await useFakeTimers(async () =>
        Test.run(ctx, defaultTimeoutInSeconds, test => {
          test.perform(test.ctx.effect);
        })
      );

      expect(ctx.effect).toHaveBeenCalledTimes(1);
    });

    it('should throw an effect error', async () => {
      ctx.effect.mockImplementationOnce(erroneous(1));
      ctx.effect.mockImplementationOnce(erroneous(2));

      await expect(
        useFakeTimers(async () =>
          Test.run(ctx, defaultTimeoutInSeconds, test => {
            test.perform(test.ctx.effect);
          })
        )
      ).rejects.toThrow('effect 1');

      expect(ctx.effect).toHaveBeenCalledTimes(1);
    });

    it('should throw a default timeout error', async () => {
      ctx.effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(ctx, defaultTimeoutInSeconds, test => {
              test.perform(test.ctx.effect);
            }),
          defaultTimeoutInSeconds
        )
      ).rejects.toThrow('Timeout after 0.01 seconds');

      expect(ctx.effect).toHaveBeenCalledTimes(1);
    });

    it('should throw a custom timeout error', async () => {
      ctx.effect.mockImplementationOnce(neverEnding);

      await expect(
        useFakeTimers(
          async () =>
            Test.run(ctx, defaultTimeoutInSeconds, test => {
              test.perform(test.ctx.effect, 1);
            }),
          1
        )
      ).rejects.toThrow('Timeout after 1 second');

      expect(ctx.effect).toHaveBeenCalledTimes(1);
    });
  });
});
