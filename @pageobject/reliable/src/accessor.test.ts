import {reliable} from '.';

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
  throw new Error(id !== undefined ? `Accessor error ${id}` : 'Accessor error');
};

const neverEnding = async () => new Promise<void>(() => undefined);

describe('reliable()', () => {
  it('should return an accessor that reliably returns a value', async () => {
    const accessor = jest
      .fn()
      .mockImplementationOnce(erroneous())
      .mockImplementation(async () => 'value');

    await expect(reliable(accessor, 100)()).resolves.toBe('value');

    expect(accessor).toHaveBeenCalledTimes(2);
  });

  it('should return an accessor that throws an accessor error', async () => {
    const accessor = jest
      .fn()
      .mockImplementationOnce(erroneous(1))
      .mockImplementationOnce(erroneous(2))
      .mockImplementation(neverEnding);

    await expect(
      observeTimeout(async () => reliable(accessor, 100)(), 100)
    ).rejects.toThrow('Accessor error 2');

    expect(accessor).toHaveBeenCalledTimes(3);
  });

  it('should return an accessor that throws an accessor-timeout error', async () => {
    const accessor = jest.fn().mockImplementation(neverEnding);

    await expect(
      observeTimeout(async () => reliable(accessor, 100)(), 100)
    ).rejects.toThrow('Accessor timeout after 100 milliseconds');

    expect(accessor).toHaveBeenCalledTimes(1);
  });

  it('should return an accessor that does not throw an out-of-memory error', async () => {
    const accessor = jest.fn().mockImplementation(erroneous());

    await expect(reliable(accessor, 10)()).rejects.toThrow('Accessor error');
  });
});
