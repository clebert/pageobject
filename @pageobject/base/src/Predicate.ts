// tslint:disable no-use-before-declare

import {ok} from 'assert';
import {inspect} from 'util';

// tslint:disable-next-line no-any
function serialize(value: any): string {
  return inspect(value, false, null);
}

function useJest(): boolean {
  // tslint:disable-next-line strict-type-predicates
  return typeof jest !== 'undefined' && typeof expect === 'function';
}

export abstract class Predicate<TValue> {
  public static is<TValue>(expected: TValue): Predicate<TValue> {
    return useJest() ? new JestIs(expected) : new Is(expected);
  }

  public static isNot<TValue>(expected: TValue): Predicate<TValue> {
    return useJest() ? new JestIsNot(expected) : new IsNot(expected);
  }

  public static isGreaterThan(expected: number): Predicate<number> {
    return useJest()
      ? new JestIsGreaterThan(expected)
      : new IsGreaterThan(expected);
  }

  public static isGreaterThanOrEquals(expected: number): Predicate<number> {
    return useJest()
      ? new JestIsGreaterThanOrEquals(expected)
      : new IsGreaterThanOrEquals(expected);
  }

  public static isLessThan(expected: number): Predicate<number> {
    return useJest() ? new JestIsLessThan(expected) : new IsLessThan(expected);
  }

  public static isLessThanOrEquals(expected: number): Predicate<number> {
    return useJest()
      ? new JestIsLessThanOrEquals(expected)
      : new IsLessThanOrEquals(expected);
  }

  public static includes(expected: string): Predicate<string> {
    return useJest() ? new JestIncludes(expected) : new Includes(expected);
  }

  public static notIncludes(expected: string): Predicate<string> {
    return useJest()
      ? new JestNotIncludes(expected)
      : new NotIncludes(expected);
  }

  public static matches(expected: RegExp): Predicate<string> {
    return useJest() ? new JestMatches(expected) : new Matches(expected);
  }

  public static notMatches(expected: RegExp): Predicate<string> {
    return useJest() ? new JestNotMatches(expected) : new NotMatches(expected);
  }

  public assert(actual: TValue): void {
    ok(this.test(actual), this.describe(actual));
  }

  public abstract test(actual: TValue): boolean;

  protected abstract describe(actual: TValue): string;
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
  public test(actual: TValue): boolean {
    return actual === this.expected;
  }

  protected describe(actual: TValue): string {
    return `${serialize(actual)} === ${serialize(this.expected)}`;
  }
}

class JestIs<TValue> extends Is<TValue> {
  public assert(actual: TValue): void {
    expect(actual).toBe(this.expected);
  }
}

class IsNot<TValue> extends Is<TValue> {
  public test(actual: TValue): boolean {
    return !super.test(actual);
  }

  protected describe(actual: TValue): string {
    return `${serialize(actual)} !== ${serialize(this.expected)}`;
  }
}

class JestIsNot<TValue> extends IsNot<TValue> {
  public assert(actual: TValue): void {
    expect(actual).not.toBe(this.expected);
  }
}

class IsGreaterThan extends BinaryPredicate<number> {
  public test(actual: number): boolean {
    return actual > this.expected;
  }

  protected describe(actual: number): string {
    return `${actual} > ${this.expected}`;
  }
}

class JestIsGreaterThan extends IsGreaterThan {
  public assert(actual: number): void {
    expect(actual).toBeGreaterThan(this.expected);
  }
}

class IsGreaterThanOrEquals extends BinaryPredicate<number> {
  public test(actual: number): boolean {
    return actual >= this.expected;
  }

  protected describe(actual: number): string {
    return `${actual} >= ${this.expected}`;
  }
}

class JestIsGreaterThanOrEquals extends IsGreaterThanOrEquals {
  public assert(actual: number): void {
    expect(actual).toBeGreaterThanOrEqual(this.expected);
  }
}

class IsLessThan extends BinaryPredicate<number> {
  public test(actual: number): boolean {
    return actual < this.expected;
  }

  protected describe(actual: number): string {
    return `${actual} < ${this.expected}`;
  }
}

class JestIsLessThan extends IsLessThan {
  public assert(actual: number): void {
    expect(actual).toBeLessThan(this.expected);
  }
}

class IsLessThanOrEquals extends BinaryPredicate<number> {
  public test(actual: number): boolean {
    return actual <= this.expected;
  }

  protected describe(actual: number): string {
    return `${actual} <= ${this.expected}`;
  }
}

class JestIsLessThanOrEquals extends IsLessThanOrEquals {
  public assert(actual: number): void {
    expect(actual).toBeLessThanOrEqual(this.expected);
  }
}

class Includes extends BinaryPredicate<string> {
  public test(actual: string): boolean {
    return actual.includes(this.expected);
  }

  protected describe(actual: string): string {
    return `${serialize(actual)} =~ ${serialize(this.expected)}`;
  }
}

class JestIncludes extends Includes {
  public assert(actual: string): void {
    expect(actual).toContain(this.expected);
  }
}

class NotIncludes extends Includes {
  public test(actual: string): boolean {
    return !super.test(actual);
  }

  protected describe(actual: string): string {
    return `${serialize(actual)} !~ ${serialize(this.expected)}`;
  }
}

class JestNotIncludes extends NotIncludes {
  public assert(actual: string): void {
    expect(actual).not.toContain(this.expected);
  }
}

class Matches extends BinaryPredicate<string, RegExp> {
  public test(actual: string): boolean {
    return this.expected.test(actual);
  }

  protected describe(actual: string): string {
    return `${serialize(actual)} =~ ${serialize(this.expected)}`;
  }
}

class JestMatches extends Matches {
  public assert(actual: string): void {
    expect(actual).toMatch(this.expected);
  }
}

class NotMatches extends Matches {
  public test(actual: string): boolean {
    return !super.test(actual);
  }

  protected describe(actual: string): string {
    return `${serialize(actual)} !~ ${serialize(this.expected)}`;
  }
}

class JestNotMatches extends NotMatches {
  public assert(actual: string): void {
    expect(actual).not.toMatch(this.expected);
  }
}
