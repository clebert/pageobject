// tslint:disable no-use-before-declare

import {deepStrictEqual} from 'assert';
import {serialize} from '.';

export abstract class Operator<TValue> {
  public static not<TValue>(operand: Operator<TValue>): Operator<TValue> {
    return new NotOperator(operand);
  }

  public static and<TValue>(
    operandA: Operator<TValue>,
    operandB: Operator<TValue>
  ): Operator<TValue> {
    return new AndOperator(operandA, operandB);
  }

  public static or<TValue>(
    operandA: Operator<TValue>,
    operandB: Operator<TValue>
  ): Operator<TValue> {
    return new OrOperator(operandA, operandB);
  }

  /**
   * This operator tests for deep, strict equality.
   */
  public static equals<TValue>(expectedValue: TValue): Operator<TValue> {
    return new EqualsOperator(expectedValue);
  }

  public static greaterThan(expectedValue: number): Operator<number> {
    return new GreaterThanOperator(expectedValue);
  }

  public static greaterThanOrEquals(expectedValue: number): Operator<number> {
    return new GreaterThanOrEqualsOperator(expectedValue);
  }

  public static lessThan(expectedValue: number): Operator<number> {
    return new LessThanOperator(expectedValue);
  }

  public static lessThanOrEquals(expectedValue: number): Operator<number> {
    return new LessThanOrEqualsOperator(expectedValue);
  }

  public static matches(expectedValue: RegExp): Operator<string> {
    return new MatchesOperator(expectedValue);
  }

  public abstract describe(valueName: string): string;
  public abstract test(value: TValue): boolean;
}

/* Logical operators **********************************************************/

abstract class LogicalUnaryOperator<TValue> extends Operator<TValue> {
  protected readonly operand: Operator<TValue>;

  protected abstract readonly symbol: string;

  public constructor(operand: Operator<TValue>) {
    super();

    this.operand = operand;
  }

  public describe(valueName: string): string {
    const {operand, symbol} = this;

    return `${symbol}${operand.describe(valueName)}`;
  }

  public abstract test(value: TValue): boolean;
}

class NotOperator<TValue> extends LogicalUnaryOperator<TValue> {
  protected readonly symbol = '!';

  public test(value: TValue): boolean {
    return !this.operand.test(value);
  }
}

abstract class LogicalBinaryOperator<TValue> extends Operator<TValue> {
  protected readonly operandA: Operator<TValue>;
  protected readonly operandB: Operator<TValue>;

  protected abstract readonly symbol: string;

  public constructor(operandA: Operator<TValue>, operandB: Operator<TValue>) {
    super();

    this.operandA = operandA;
    this.operandB = operandB;
  }

  public describe(valueName: string): string {
    const {operandA, operandB, symbol} = this;

    return `(${operandA.describe(valueName)} ${symbol} ${operandB.describe(
      valueName
    )})`;
  }

  public abstract test(value: TValue): boolean;
}

class AndOperator<TValue> extends LogicalBinaryOperator<TValue> {
  protected readonly symbol = '&&';

  public test(value: TValue): boolean {
    return this.operandA.test(value) && this.operandB.test(value);
  }
}

class OrOperator<TValue> extends LogicalBinaryOperator<TValue> {
  protected readonly symbol = '||';

  public test(value: TValue): boolean {
    return this.operandA.test(value) || this.operandB.test(value);
  }
}

/* Relational operators *******************************************************/

abstract class RelationalOperator<
  TActualValue,
  TExpectedValue
> extends Operator<TActualValue> {
  protected readonly expectedValue: TExpectedValue;

  protected abstract readonly symbol: string;

  public constructor(expectedValue: TExpectedValue) {
    super();

    this.expectedValue = expectedValue;
  }

  public describe(valueName: string): string {
    const {expectedValue, symbol} = this;

    return `(${valueName} ${symbol} ${serialize(expectedValue)})`;
  }

  public abstract test(value: TActualValue): boolean;
}

class EqualsOperator<TValue> extends RelationalOperator<TValue, TValue> {
  protected readonly symbol = '==';

  public test(value: TValue): boolean {
    try {
      deepStrictEqual(value, this.expectedValue);

      return true;
    } catch {
      return false;
    }
  }
}

class GreaterThanOperator extends RelationalOperator<number, number> {
  protected readonly symbol = '>';

  public test(value: number): boolean {
    return value > this.expectedValue;
  }
}

class GreaterThanOrEqualsOperator extends RelationalOperator<number, number> {
  protected readonly symbol = '>=';

  public test(value: number): boolean {
    return value >= this.expectedValue;
  }
}

class LessThanOperator extends RelationalOperator<number, number> {
  protected readonly symbol = '<';

  public test(value: number): boolean {
    return value < this.expectedValue;
  }
}

class LessThanOrEqualsOperator extends RelationalOperator<number, number> {
  protected readonly symbol = '<=';

  public test(value: number): boolean {
    return value <= this.expectedValue;
  }
}

class MatchesOperator extends RelationalOperator<string, RegExp> {
  protected readonly symbol = '=~';

  public test(value: string): boolean {
    return this.expectedValue.test(value);
  }
}
