import {createRetryEngine} from '.';

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
  throw new Error(id !== undefined ? `commandError${id}` : 'commandError');
};

const neverEnding = async () => new Promise<void>(() => undefined);

const {retryOnError} = createRetryEngine(10);

describe('retryOnError()', () => {
  it('should execute the specified command within the specified timeout', async () => {
    const command = jest
      .fn()
      .mockImplementationOnce(erroneous())
      .mockImplementation(async () => 'result');

    await expect(retryOnError(command, 20)).resolves.toBe('result');

    expect(command).toHaveBeenCalledTimes(2);
  });

  it('should execute the specified command within the default timeout', async () => {
    const command = jest
      .fn()
      .mockImplementationOnce(erroneous())
      .mockImplementation(async () => 'result');

    await expect(retryOnError(command)).resolves.toBe('result');

    expect(command).toHaveBeenCalledTimes(2);
  });

  it('should fail to successfully execute the specified command within the specified timeout', async () => {
    const command = jest
      .fn()
      .mockImplementationOnce(erroneous(1))
      .mockImplementationOnce(erroneous(2))
      .mockImplementation(neverEnding);

    await expect(
      observeTimeout(async () => retryOnError(command, 20), 20)
    ).rejects.toThrow('commandError2');

    expect(command).toHaveBeenCalledTimes(3);
  });

  it('should fail to successfully execute the specified command within the default timeout', async () => {
    const command = jest
      .fn()
      .mockImplementationOnce(erroneous(1))
      .mockImplementationOnce(erroneous(2))
      .mockImplementation(neverEnding);

    await expect(
      observeTimeout(async () => retryOnError(command), 10)
    ).rejects.toThrow('commandError2');

    expect(command).toHaveBeenCalledTimes(3);
  });

  it('should not throw an out-of-memory error', async () => {
    const command = jest.fn().mockImplementation(erroneous());

    await expect(retryOnError(command)).rejects.toThrow('commandError');
  });
});
