export type Command<TResult> = () => Promise<TResult>;

export interface RetryEngine<TResult> {
  retryOnError(command: Command<TResult>, timeout?: number): Promise<TResult>;
}

/**
 * `import {createRetryEngine} from '@pageobject/engine';`
 */
export function createRetryEngine<TResult = void>(
  defaultTimeout: number
): RetryEngine<TResult> {
  return {
    retryOnError: async (command, timeout = defaultTimeout) => {
      let error = new Error(`Timeout after ${timeout} milliseconds`);
      let resolved = false;

      let timeoutID: any; /* tslint:disable-line no-any */

      return Promise.race([
        (async () => {
          while (!resolved) {
            try {
              const result = await command();

              clearTimeout(timeoutID);

              return result;
            } catch (e) {
              error = e;
            }

            await new Promise<void>(setImmediate);
          }

          /* istanbul ignore next */
          throw error;
        })(),
        (async () => {
          await new Promise<void>(resolve => {
            timeoutID = setTimeout(resolve, timeout);
          });

          resolved = true;

          throw error;
        })()
      ]);
    }
  };
}
