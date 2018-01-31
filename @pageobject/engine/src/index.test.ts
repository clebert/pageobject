import {execute} from '.';

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

const erroneous = (n?: number) => async () => {
  throw new Error(n !== undefined ? `commandError${n}` : 'commandError');
};

const neverending = async () => new Promise<void>(() => undefined);

describe('execute()', () => {
  it('should execute the specified command', async () => {
    const command = jest
      .fn()
      .mockImplementationOnce(erroneous())
      .mockImplementation(async () => 'result');

    await expect(execute(command, 10)).resolves.toBe('result');

    expect(command).toHaveBeenCalledTimes(2);
  });

  it('should fail to execute the specified command', async () => {
    const command = jest
      .fn()
      .mockImplementationOnce(erroneous(1))
      .mockImplementationOnce(erroneous(2))
      .mockImplementation(neverending);

    await expect(
      observeTimeout(async () => execute(command, 123), 123)
    ).rejects.toThrow('commandError2');

    expect(command).toHaveBeenCalledTimes(3);
  });

  it('should not throw an out-of-memory error', async () => {
    const command = jest.fn().mockImplementation(erroneous());

    await expect(execute(command, 10)).rejects.toThrow('commandError');
  });
});
