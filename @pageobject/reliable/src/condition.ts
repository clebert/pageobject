import {inspect} from 'util';
import {Accessor, reliable} from '.';

export interface Evaluation {
  readonly description: string;
  readonly result: boolean;
}

export interface Operator<TValue> {
  describe(valueName: string): string;
  test(value: TValue): boolean;
}

function reliableIfRequired<TValue>(
  accessor: Accessor<TValue>,
  timeout: number | undefined
): Accessor<TValue> {
  return typeof timeout === 'number' ? reliable(accessor, timeout) : accessor;
}

/* tslint:disable-next-line no-any */
function serialize(value: any): string {
  return inspect(value, false, null);
}

export class Condition<TValue> {
  private readonly _operator: Operator<TValue>;
  private readonly _valueAccessor: Accessor<TValue>;
  private readonly _valueName: string;

  public constructor(
    operator: Operator<TValue>,
    valueAccessor: Accessor<TValue>,
    valueName: string
  ) {
    this._operator = operator;
    this._valueAccessor = valueAccessor;
    this._valueName = valueName;
  }

  public describe(): string {
    return this._operator.describe(`<${this._valueName}>`);
  }

  public async assert(timeout?: number): Promise<void> {
    const evaluation = await this.evaluate(timeout);

    if (!evaluation.result) {
      throw new Error(`Assertion failed: ${evaluation.description}`);
    }
  }

  public async evaluate(timeout?: number): Promise<Evaluation> {
    const value = await reliableIfRequired(this._valueAccessor, timeout)();

    return {
      description: this._operator.describe(
        `(<${this._valueName}> = ${serialize(value)})`
      ),
      result: this._operator.test(value)
    };
  }

  public async test(timeout?: number): Promise<boolean> {
    return this._operator.test(
      await reliableIfRequired(this._valueAccessor, timeout)()
    );
  }
}
