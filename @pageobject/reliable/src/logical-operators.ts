import {Operator} from '.';

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
