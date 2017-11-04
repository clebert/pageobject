import {retryOnError} from '../retryOnError';

const retryDelay = 10;
const timeout = retryDelay * 5;

/* This function works in conjunction with Jest fake timers. */
async function nap(): Promise<void> {
  for (let i = 0; i < 10; i += 1) {
    await Promise.resolve();
  }
}

async function advanceTimersToTimeout(): Promise<void> {
  let time = 0;

  while (time < timeout) {
    time += retryDelay;

    jest.runTimersToTime(retryDelay);

    await nap();
  }
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('retryOnError(action, retryDelay, timeout)', () => {
  describe('called with an action that never returns', () => {
    it('should call the action once and throw a timeout error', async () => {
      const action = jest.fn(async () => new Promise<void>(() => undefined));
      const promise = retryOnError(action, retryDelay, timeout);

      await advanceTimersToTimeout();

      expect(action.mock.calls.length).toBe(1);

      await expect(promise).rejects.toEqual(
        new Error(`Timeout after ${timeout} milliseconds`)
      );
    });
  });

  describe('called with an action that always throws an error', () => {
    it('should call the action multiple times and rethrow its error after the timeout has expired', async () => {
      const action = jest.fn(async () => {
        throw new Error('mockMessage');
      });

      const promise = retryOnError(action, retryDelay, timeout);

      await advanceTimersToTimeout();

      expect(action.mock.calls.length).toBe(timeout / retryDelay - 1);

      await expect(promise).rejects.toEqual(new Error('mockMessage'));
    });
  });

  describe('called with an action that returns on the third call', () => {
    it('should call the action three times and return its result', async () => {
      const action = jest
        .fn()
        .mockImplementationOnce(async () => {
          throw new Error('mockMessage');
        })
        .mockImplementationOnce(async () => {
          throw new Error('mockMessage');
        })
        .mockImplementation(async () => 'mockResult');

      const promise = retryOnError(action, retryDelay, timeout);

      await advanceTimersToTimeout();

      expect(action.mock.calls.length).toBe(3);

      expect(await promise).toBe('mockResult');
    });
  });
});
