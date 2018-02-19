import {inspect} from 'util';
import {Operator} from '.';

/* tslint:disable-next-line no-any */
function serialize(value: any): string {
  return inspect(value, false, null);
}

abstract class RelationalOperator<TActualValue, TExpectedValue>
  implements Operator<TActualValue> {
  protected readonly expectedValue: TExpectedValue;

  protected abstract readonly name: string;

  public constructor(expectedValue: TExpectedValue) {
    this.expectedValue = expectedValue;
  }

  public describe(valueName: string): string {
    const {expectedValue, name} = this;

    return `(${valueName} ${name} ${serialize(expectedValue)})`;
  }

  public abstract test(value: TActualValue): boolean;
}

class EqualsOperator<TValue> extends RelationalOperator<TValue, TValue> {
  protected readonly name = 'EQUALS';

  public test(value: TValue): boolean {
    return value === this.expectedValue;
  }
}

export function equals<TValue>(expectedValue: TValue): Operator<TValue> {
  return new EqualsOperator(expectedValue);
}

class GreaterThanOperator extends RelationalOperator<number, number> {
  protected readonly name = 'GREATER THAN';

  public test(value: number): boolean {
    return value > this.expectedValue;
  }
}

export function greaterThan(expectedValue: number): Operator<number> {
  return new GreaterThanOperator(expectedValue);
}

class GreaterThanOrEqualsOperator extends RelationalOperator<number, number> {
  protected readonly name = 'GREATER THAN OR EQUALS';

  public test(value: number): boolean {
    return value >= this.expectedValue;
  }
}

export function greaterThanOrEquals(expectedValue: number): Operator<number> {
  return new GreaterThanOrEqualsOperator(expectedValue);
}

class LessThanOperator extends RelationalOperator<number, number> {
  protected readonly name = 'LESS THAN';

  public test(value: number): boolean {
    return value < this.expectedValue;
  }
}

export function lessThan(expectedValue: number): Operator<number> {
  return new LessThanOperator(expectedValue);
}

class LessThanOrEqualsOperator extends RelationalOperator<number, number> {
  protected readonly name = 'LESS THAN OR EQUALS';

  public test(value: number): boolean {
    return value <= this.expectedValue;
  }
}

export function lessThanOrEquals(expectedValue: number): Operator<number> {
  return new LessThanOrEqualsOperator(expectedValue);
}

class MatchesOperator extends RelationalOperator<string, RegExp> {
  protected readonly name = 'MATCHES';

  public test(value: string): boolean {
    return this.expectedValue.test(value);
  }
}

export function matches(expectedValue: RegExp): Operator<string> {
  return new MatchesOperator(expectedValue);
}
