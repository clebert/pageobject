export type Accessor<TValue> = () => Promise<TValue>;

export function reliable<TValue>(
  accessor: Accessor<TValue>,
  timeout: number
): Accessor<TValue> {
  return async () => {
    let error = new Error(`Accessor timeout after ${timeout} milliseconds`);
    let resolved = false;

    let timeoutID: any; /* tslint:disable-line no-any */

    return Promise.race([
      (async () => {
        while (!resolved) {
          try {
            const result = await accessor();

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
  };
}
