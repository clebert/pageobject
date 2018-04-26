// tslint:disable no-use-before-declare

import {inspect} from 'util';

// tslint:disable-next-line no-any
function serialize(value: any, valueName?: string): string {
  const valueString = inspect(value, false, null);

  return valueName ? `(${valueName} = ${valueString})` : valueString;
}

export abstract class Predicate<TValue> {
  public static is<TValue>(expected: TValue): Predicate<TValue> {
    return new Is(expected);
  }

  public static isNot<TValue>(expected: TValue): Predicate<TValue> {
    return new IsNot(expected);
  }

  public static isGreaterThan(expected: number): Predicate<number> {
    return new IsGreaterThan(expected);
  }

  public static isGreaterThanOrEqual(expected: number): Predicate<number> {
    return new IsGreaterThanOrEqual(expected);
  }

  public static isLessThan(expected: number): Predicate<number> {
    return new IsLessThan(expected);
  }

  public static isLessThanOrEqual(expected: number): Predicate<number> {
    return new IsLessThanOrEqual(expected);
  }

  public static includes(expected: string): Predicate<string> {
    return new Includes(expected);
  }

  public static notIncludes(expected: string): Predicate<string> {
    return new NotIncludes(expected);
  }

  public static matches(expected: RegExp): Predicate<string> {
    return new Matches(expected);
  }

  public static notMatches(expected: RegExp): Predicate<string> {
    return new NotMatches(expected);
  }

  public abstract describe(actual: TValue, valueName?: string): string;
  public abstract test(actual: TValue): boolean;
}

abstract class BinaryPredicate<TActual, TExpected = TActual> extends Predicate<
  TActual
> {
  public readonly expected: TExpected;

  public constructor(expected: TExpected) {
    super();

    this.expected = expected;
  }
}

class Is<TValue> extends BinaryPredicate<TValue> {
  public describe(actual: TValue, valueName?: string): string {
    return `${serialize(actual, valueName)} === ${serialize(this.expected)}`;
  }

  public test(actual: TValue): boolean {
    return actual === this.expected;
  }
}

class IsNot<TValue> extends Is<TValue> {
  public describe(actual: TValue, valueName?: string): string {
    return `${serialize(actual, valueName)} !== ${serialize(this.expected)}`;
  }

  public test(actual: TValue): boolean {
    return !super.test(actual);
  }
}

class IsGreaterThan extends BinaryPredicate<number> {
  public describe(actual: number, valueName?: string): string {
    return `${serialize(actual, valueName)} > ${serialize(this.expected)}`;
  }

  public test(actual: number): boolean {
    return actual > this.expected;
  }
}

class IsGreaterThanOrEqual extends BinaryPredicate<number> {
  public describe(actual: number, valueName?: string): string {
    return `${serialize(actual, valueName)} >= ${serialize(this.expected)}`;
  }

  public test(actual: number): boolean {
    return actual >= this.expected;
  }
}

class IsLessThan extends BinaryPredicate<number> {
  public describe(actual: number, valueName?: string): string {
    return `${serialize(actual, valueName)} < ${serialize(this.expected)}`;
  }

  public test(actual: number): boolean {
    return actual < this.expected;
  }
}

class IsLessThanOrEqual extends BinaryPredicate<number> {
  public describe(actual: number, valueName?: string): string {
    return `${serialize(actual, valueName)} <= ${serialize(this.expected)}`;
  }

  public test(actual: number): boolean {
    return actual <= this.expected;
  }
}

class Includes extends BinaryPredicate<string> {
  public describe(actual: string, valueName?: string): string {
    return `${serialize(actual, valueName)} =~ ${serialize(this.expected)}`;
  }

  public test(actual: string): boolean {
    return actual.includes(this.expected);
  }
}

class NotIncludes extends Includes {
  public describe(actual: string, valueName?: string): string {
    return `${serialize(actual, valueName)} !~ ${serialize(this.expected)}`;
  }

  public test(actual: string): boolean {
    return !super.test(actual);
  }
}

class Matches extends BinaryPredicate<string, RegExp> {
  public describe(actual: string, valueName?: string): string {
    return `${serialize(actual, valueName)} =~ ${serialize(this.expected)}`;
  }

  public test(actual: string): boolean {
    return this.expected.test(actual);
  }
}

class NotMatches extends Matches {
  public describe(actual: string, valueName?: string): string {
    return `${serialize(actual, valueName)} !~ ${serialize(this.expected)}`;
  }

  public test(actual: string): boolean {
    return !super.test(actual);
  }
}
