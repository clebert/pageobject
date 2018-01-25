/**
 * `import {execute} from '@pageobject/engine';`
 */
export async function execute<TResult>(
  command: () => Promise<TResult>,
  explicitTimeout: number | string | undefined = process.env.IMPLICIT_TIMEOUT
): Promise<TResult> {
  if (explicitTimeout === undefined) {
    throw new Error('Please specify an explicit or implicit timeout value');
  }

  const timeout = parseInt(String(explicitTimeout), 10);

  if (!Number.isFinite(timeout)) {
    throw new Error('Invalid timeout value');
  }

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
