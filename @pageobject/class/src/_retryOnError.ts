export type Action<T> = () => Promise<T>;

export async function retryOnError<T>(
  action: Action<T>,
  retryDelay: number,
  timeout: number
): Promise<T> {
  let error = new Error(`Timeout after ${timeout} milliseconds`);
  let expired = false;

  /* tslint:disable no-any */
  let timeoutId1: any;
  let timeoutId2: any;
  /* tslint:enable no-any */

  return Promise.race([
    (async () => {
      while (!expired) {
        try {
          const result = await action();

          clearTimeout(timeoutId2);

          return result;
        } catch (e) {
          error = e;
        }

        await new Promise<void>(resolve => {
          timeoutId1 = setTimeout(resolve, retryDelay);
        });
      }

      /* istanbul ignore next */
      throw error;
    })(),
    (async () => {
      await new Promise<void>(resolve => {
        timeoutId2 = setTimeout(resolve, timeout);
      });

      expired = true;

      clearTimeout(timeoutId1);

      throw error;
    })()
  ]);
}
