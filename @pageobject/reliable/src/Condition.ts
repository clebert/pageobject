import {inspect} from 'util';
import {Operator} from '.';

export type Accessor<TValue> = () => Promise<TValue>;

export interface Evaluation {
  readonly description: string;
  readonly result: boolean;
}

/* tslint:disable-next-line no-any */
function serialize(value: any): string {
  return inspect(value, false, null);
}

/* tslint:disable-next-line no-any */
export class Condition<TValue = any> {
  public readonly operator: Operator<TValue>;
  public readonly valueAccessor: Accessor<TValue>;
  public readonly valueName: string;

  public constructor(
    operator: Operator<TValue>,
    valueAccessor: Accessor<TValue>,
    valueName: string
  ) {
    this.operator = operator;
    this.valueAccessor = valueAccessor;
    this.valueName = valueName;
  }

  public describe(): string {
    return this.operator.describe(this.valueName);
  }

  public async assert(): Promise<void> {
    const evaluation = await this.evaluate();

    if (!evaluation.result) {
      throw new Error(`Assertion failed: ${evaluation.description}`);
    }
  }

  public async evaluate(): Promise<Evaluation> {
    const value = await this.valueAccessor();

    return {
      description: this.operator.describe(
        `(${this.valueName} = ${serialize(value)})`
      ),
      result: this.operator.test(value)
    };
  }

  public async test(): Promise<boolean> {
    return this.operator.test(await this.valueAccessor());
  }
}
