import {deepStrictEqual} from 'assert';
import {inspect} from 'util';

export interface Operator<TValue> {
  describe(valueName: string): string;
  test(value: TValue): boolean;
}

/* LogicalOperator ************************************************************/

abstract class LogicalBinaryOperator<TValue> implements Operator<TValue> {
  protected readonly operandA: Operator<TValue>;
  protected readonly operandB: Operator<TValue>;

  protected abstract readonly name: string;

  public constructor(operandA: Operator<TValue>, operandB: Operator<TValue>) {
    this.operandA = operandA;
    this.operandB = operandB;
  }

  public describe(valueName: string): string {
    const {name, operandA, operandB} = this;

    return `(${operandA.describe(valueName)} ${name} ${operandB.describe(
      valueName
    )})`;
  }

  public abstract test(value: TValue): boolean;
}

abstract class LogicalUnaryOperator<TValue> implements Operator<TValue> {
  protected readonly operand: Operator<TValue>;

  protected abstract readonly name: string;

  public constructor(operand: Operator<TValue>) {
    this.operand = operand;
  }

  public describe(valueName: string): string {
    const {name, operand} = this;

    return `(${name} ${operand.describe(valueName)})`;
  }

  public abstract test(value: TValue): boolean;
}

class AndOperator<TValue> extends LogicalBinaryOperator<TValue> {
  protected readonly name = 'AND';

  public test(value: TValue): boolean {
    return this.operandA.test(value) && this.operandB.test(value);
  }
}

export function and<TValue>(
  operandA: Operator<TValue>,
  operandB: Operator<TValue>
): Operator<TValue> {
  return new AndOperator(operandA, operandB);
}

class OrOperator<TValue> extends LogicalBinaryOperator<TValue> {
  protected readonly name = 'OR';

  public test(value: TValue): boolean {
    return this.operandA.test(value) || this.operandB.test(value);
  }
}

export function or<TValue>(
  operandA: Operator<TValue>,
  operandB: Operator<TValue>
): Operator<TValue> {
  return new OrOperator(operandA, operandB);
}

class NotOperator<TValue> extends LogicalUnaryOperator<TValue> {
  protected readonly name = 'NOT';

  public test(value: TValue): boolean {
    return !this.operand.test(value);
  }
}

export function not<TValue>(operand: Operator<TValue>): Operator<TValue> {
  return new NotOperator(operand);
}

/* RelationalOperator *********************************************************/

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
    try {
      deepStrictEqual(value, this.expectedValue);

      return true;
    } catch {
      return false;
    }
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
