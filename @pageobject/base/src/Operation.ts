// tslint:disable no-use-before-declare

import {FunctionCall, Operator, serialize} from '.';

export abstract class Operation {
  public static defaultTimeoutInSeconds = 5;

  public static assert<TValue>(
    getter: FunctionCall<TValue>,
    operator: Operator<TValue>,
    timeoutInSeconds?: number
  ): Operation {
    return new Assertion(getter, operator, timeoutInSeconds);
  }

  public static if<TValue>(
    getter: FunctionCall<TValue>,
    operator: Operator<TValue>,
    thenOperations: Operation[],
    elseOperations: Operation[] = [],
    timeoutInSeconds?: number
  ): Operation {
    return new Conditional(
      getter,
      operator,
      thenOperations,
      elseOperations,
      timeoutInSeconds
    );
  }

  public static perform(
    method: FunctionCall<void>,
    timeoutInSeconds?: number
  ): Operation {
    return new Action(method, timeoutInSeconds);
  }

  public static async executeAll(operations: Operation[]): Promise<void> {
    for (const operation of operations) {
      await Operation.executeAll(await operation.execute());
    }
  }

  public readonly timeoutInSeconds: number;

  public constructor(
    timeoutInSeconds: number = Operation.defaultTimeoutInSeconds
  ) {
    this.timeoutInSeconds = timeoutInSeconds;
  }

  public abstract execute(): Promise<Operation[]>;
}

async function execute<TResult>(
  executable: () => Promise<TResult>,
  retryOnError: boolean,
  timeoutInSeconds: number
): Promise<TResult> {
  let message = `Timeout after ${timeoutInSeconds} second${
    timeoutInSeconds === 1 ? '' : 's'
  }`;

  let resolved = false;
  let timeoutID: any; /* tslint:disable-line no-any */

  return Promise.race([
    (async () => {
      while (!resolved) {
        try {
          const result = await executable();

          clearTimeout(timeoutID);

          return result;
        } catch (error) {
          if (!retryOnError) {
            clearTimeout(timeoutID);

            throw error;
          }

          message = error.message;
        }

        await new Promise<void>(setImmediate);
      }

      throw new Error(message);
    })(),
    (async () => {
      await new Promise<void>(resolve => {
        timeoutID = setTimeout(resolve, timeoutInSeconds * 1000);
      });

      resolved = true;

      throw new Error(message);
    })()
  ]);
}

class Action extends Operation {
  public readonly method: FunctionCall<void>;

  public constructor(
    method: FunctionCall<void>,
    timeoutInSeconds: number | undefined
  ) {
    super(timeoutInSeconds);

    this.method = method;
  }

  public async execute(): Promise<Operation[]> {
    try {
      await execute(this.method.executable, false, this.timeoutInSeconds);

      return [];
    } catch (error) {
      const message = `Perform: ${this.method.description}\n  Context: ${
        this.method.context.description
      }\n  Cause: ${error.message}`;

      throw new Error(message);
    }
  }
}

class Assertion<TValue> extends Operation {
  public readonly getter: FunctionCall<TValue>;
  public readonly operator: Operator<TValue>;

  public constructor(
    getter: FunctionCall<TValue>,
    operator: Operator<TValue>,
    timeoutInSeconds: number | undefined
  ) {
    super(timeoutInSeconds);

    this.getter = getter;
    this.operator = operator;
  }

  public async execute(): Promise<Operation[]> {
    try {
      await execute(
        async () => {
          const value = await this.getter.executable();

          if (!this.operator.test(value)) {
            const message = `Assertion failed: ${this.operator.describe(
              `(${this.getter.description} => ${serialize(value)})`
            )}`;

            throw new Error(message);
          }
        },
        true,
        this.timeoutInSeconds
      );

      return [];
    } catch (error) {
      const message = `Assert: ${this.operator.describe(
        this.getter.description
      )}\n  Context: ${this.getter.context.description}\n  Cause: ${
        error.message
      }`;

      throw new Error(message);
    }
  }
}

class Conditional<TValue> extends Operation {
  public readonly getter: FunctionCall<TValue>;
  public readonly operator: Operator<TValue>;
  public readonly thenOperations: Operation[];
  public readonly elseOperations: Operation[];

  public constructor(
    getter: FunctionCall<TValue>,
    operator: Operator<TValue>,
    thenOperations: Operation[],
    elseOperations: Operation[],
    timeoutInSeconds: number | undefined
  ) {
    super(timeoutInSeconds);

    this.getter = getter;
    this.operator = operator;
    this.thenOperations = thenOperations;
    this.elseOperations = elseOperations;
  }

  public async execute(): Promise<Operation[]> {
    try {
      return await execute(
        async () =>
          this.operator.test(await this.getter.executable())
            ? this.thenOperations
            : this.elseOperations,
        true,
        this.timeoutInSeconds
      );
    } catch (error) {
      const message = `If: ${this.operator.describe(
        this.getter.description
      )}\n  Context: ${this.getter.context.description}\n  Cause: ${
        error.message
      }`;

      throw new Error(message);
    }
  }
}
