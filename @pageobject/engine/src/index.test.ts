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
  throw new Error(n !== undefined ? `Command error ${n}` : 'Command error');
};

const neverending = async () => new Promise<void>(() => undefined);

describe('execute()', () => {
  const explicitTimeout = 10;
  const implicitTimeout = 20;

  beforeEach(() => {
    process.env.IMPLICIT_TIMEOUT = String(implicitTimeout);
  });

  afterEach(() => {
    process.env.IMPLICIT_TIMEOUT = undefined;
  });

  it('should throw a missing-timeout-value error', async () => {
    process.env.IMPLICIT_TIMEOUT = undefined;

    await expect(execute(jest.fn())).rejects.toThrow(
      'Please specify an explicit or implicit timeout value'
    );
  });

  it('should throw an invalid-timeout-value error', async () => {
    await expect(execute(jest.fn(), NaN)).rejects.toThrow(
      'Invalid timeout value'
    );

    process.env.IMPLICIT_TIMEOUT = 'NaN';

    await expect(execute(jest.fn())).rejects.toThrow('Invalid timeout value');
  });

  it('should execute the given command using an explicit timeout', async () => {
    const command = jest
      .fn()
      .mockImplementationOnce(erroneous())
      .mockImplementation(async () => 'result');

    await expect(execute(command, explicitTimeout)).resolves.toBe('result');

    expect(command).toHaveBeenCalledTimes(2);
  });

  it('should execute the given command using an implicit timeout', async () => {
    const command = jest
      .fn()
      .mockImplementationOnce(erroneous())
      .mockImplementation(async () => 'result');

    await expect(execute(command)).resolves.toBe('result');

    expect(command).toHaveBeenCalledTimes(2);
  });

  it('should fail to execute the given command using an explicit timeout', async () => {
    const command = jest
      .fn()
      .mockImplementationOnce(erroneous(1))
      .mockImplementationOnce(erroneous(2))
      .mockImplementation(neverending);

    await expect(
      observeTimeout(
        async () => execute(command, explicitTimeout),
        explicitTimeout
      )
    ).rejects.toThrow('Command error 2');

    expect(command).toHaveBeenCalledTimes(3);
  });

  it('should fail to execute the given command using an implicit timeout', async () => {
    const command = jest
      .fn()
      .mockImplementationOnce(erroneous(1))
      .mockImplementationOnce(erroneous(2))
      .mockImplementation(neverending);

    await expect(
      observeTimeout(async () => execute(command), implicitTimeout)
    ).rejects.toThrow('Command error 2');

    expect(command).toHaveBeenCalledTimes(3);
  });

  it('should not throw an out-of-memory error', async () => {
    const command = jest.fn().mockImplementation(erroneous());

    await expect(execute(command)).rejects.toThrow('Command error');
  });
});
