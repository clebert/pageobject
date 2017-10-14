export type Action<T> = () => Promise<T>;

function getRetryDelay(): number {
  const {PAGEOBJECT_RETRY_DELAY: maybeRetryDelay} = process.env;

  return maybeRetryDelay ? parseInt(maybeRetryDelay, 10) : 250;
}

function getTimeout(): number {
  const {PAGEOBJECT_TIMEOUT: maybeTimeout} = process.env;

  return maybeTimeout ? parseInt(maybeTimeout, 10) : 10000;
}

function createTimeoutError(): Error {
  return new Error(`Timeout after ${getTimeout()} milliseconds`);
}

export async function reliable<T>(action: Action<T>): Promise<T> {
  let expired = false;

  let error: Error | undefined;
  let timeoutId1: NodeJS.Timer | undefined;
  let timeoutId2: NodeJS.Timer | undefined;

  return Promise.race([
    (async () => {
      while (!expired) {
        try {
          const result = await action();

          if (timeoutId2 !== undefined) {
            clearTimeout(timeoutId2);
          }

          return result;
        } catch (e) {
          error = e;
        }

        await new Promise<void>(
          resolve => (timeoutId1 = setTimeout(resolve, getRetryDelay()))
        );
      }

      throw error || createTimeoutError();
    })(),
    (async () => {
      await new Promise<void>(resolve => {
        timeoutId2 = setTimeout(resolve, getTimeout());
      });

      expired = true;

      if (timeoutId1 !== undefined) {
        clearTimeout(timeoutId1);
      }

      throw error || createTimeoutError();
    })()
  ]);
}
