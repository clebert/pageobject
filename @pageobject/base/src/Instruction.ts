// tslint:disable no-use-before-declare

import {Operator, serialize} from '.';

export interface Describable {
  readonly description: string;
}

export interface Effect<TResult> extends Describable {
  readonly context: Describable;

  trigger(): Promise<TResult>;
}

export abstract class Instruction {
  public static defaultTimeoutInSeconds = 5;

  public static assert<TValue>(
    effect: Effect<TValue>,
    operator: Operator<TValue>,
    timeoutInSeconds?: number
  ): Instruction {
    return new Assertion(effect, operator, timeoutInSeconds);
  }

  public static if<TValue>(
    effect: Effect<TValue>,
    operator: Operator<TValue>,
    thenInstructions: Instruction[],
    elseInstructions: Instruction[] = [],
    timeoutInSeconds?: number
  ): Instruction {
    return new Conditional(
      effect,
      operator,
      thenInstructions,
      elseInstructions,
      timeoutInSeconds
    );
  }

  public static perform(
    effect: Effect<void>,
    timeoutInSeconds?: number
  ): Instruction {
    return new Action(effect, timeoutInSeconds);
  }

  public static async executeAll(instructions: Instruction[]): Promise<void> {
    for (const instruction of instructions) {
      await Instruction.executeAll(await instruction.execute());
    }
  }

  public readonly timeoutInSeconds: number;

  public constructor(
    timeoutInSeconds: number = Instruction.defaultTimeoutInSeconds
  ) {
    this.timeoutInSeconds = timeoutInSeconds;
  }

  public abstract execute(): Promise<Instruction[]>;
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

class Action extends Instruction {
  public readonly effect: Effect<void>;

  public constructor(
    effect: Effect<void>,
    timeoutInSeconds: number | undefined
  ) {
    super(timeoutInSeconds);

    this.effect = effect;
  }

  public async execute(): Promise<Instruction[]> {
    try {
      await execute(
        async () => this.effect.trigger(),
        false,
        this.timeoutInSeconds
      );

      return [];
    } catch (error) {
      const message = `Perform: ${this.effect.description}\n  Context: ${
        this.effect.context.description
      }\n  Cause: ${error.message}`;

      throw new Error(message);
    }
  }
}

class Assertion<TValue> extends Instruction {
  public readonly effect: Effect<TValue>;
  public readonly operator: Operator<TValue>;

  public constructor(
    effect: Effect<TValue>,
    operator: Operator<TValue>,
    timeoutInSeconds: number | undefined
  ) {
    super(timeoutInSeconds);

    this.effect = effect;
    this.operator = operator;
  }

  public async execute(): Promise<Instruction[]> {
    try {
      await execute(
        async () => {
          const value = await this.effect.trigger();

          if (!this.operator.test(value)) {
            const message = `Assertion failed: ${this.operator.describe(
              `(${this.effect.description} => ${serialize(value)})`
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
        this.effect.description
      )}\n  Context: ${this.effect.context.description}\n  Cause: ${
        error.message
      }`;

      throw new Error(message);
    }
  }
}

class Conditional<TValue> extends Instruction {
  public readonly effect: Effect<TValue>;
  public readonly operator: Operator<TValue>;
  public readonly thenInstructions: Instruction[];
  public readonly elseInstructions: Instruction[];

  public constructor(
    effect: Effect<TValue>,
    operator: Operator<TValue>,
    thenInstructions: Instruction[],
    elseInstructions: Instruction[],
    timeoutInSeconds: number | undefined
  ) {
    super(timeoutInSeconds);

    this.effect = effect;
    this.operator = operator;
    this.thenInstructions = thenInstructions;
    this.elseInstructions = elseInstructions;
  }

  public async execute(): Promise<Instruction[]> {
    try {
      return await execute(
        async () =>
          this.operator.test(await this.effect.trigger())
            ? this.thenInstructions
            : this.elseInstructions,
        true,
        this.timeoutInSeconds
      );
    } catch (error) {
      const message = `If: ${this.operator.describe(
        this.effect.description
      )}\n  Context: ${this.effect.context.description}\n  Cause: ${
        error.message
      }`;

      throw new Error(message);
    }
  }
}
