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

  public static isGreaterThanOrEqual(expected: number): Predicate<number> {
    return useJest()
      ? new JestIsGreaterThanOrEqual(expected)
      : new IsGreaterThanOrEqual(expected);
  }

  public static isLessThan(expected: number): Predicate<number> {
    return useJest() ? new JestIsLessThan(expected) : new IsLessThan(expected);
  }

  public static isLessThanOrEqual(expected: number): Predicate<number> {
    return useJest()
      ? new JestIsLessThanOrEqual(expected)
      : new IsLessThanOrEqual(expected);
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

  public abstract describe(actual: TValue): string;
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
  public describe(actual: TValue): string {
    return `${serialize(actual)} === ${serialize(this.expected)}`;
  }

  public test(actual: TValue): boolean {
    return actual === this.expected;
  }
}

class JestIs<TValue> extends Is<TValue> {
  public assert(actual: TValue): void {
    expect(actual).toBe(this.expected);
  }
}

class IsNot<TValue> extends Is<TValue> {
  public describe(actual: TValue): string {
    return `${serialize(actual)} !== ${serialize(this.expected)}`;
  }

  public test(actual: TValue): boolean {
    return !super.test(actual);
  }
}

class JestIsNot<TValue> extends IsNot<TValue> {
  public assert(actual: TValue): void {
    expect(actual).not.toBe(this.expected);
  }
}

class IsGreaterThan extends BinaryPredicate<number> {
  public describe(actual: number): string {
    return `${actual} > ${this.expected}`;
  }

  public test(actual: number): boolean {
    return actual > this.expected;
  }
}

class JestIsGreaterThan extends IsGreaterThan {
  public assert(actual: number): void {
    expect(actual).toBeGreaterThan(this.expected);
  }
}

class IsGreaterThanOrEqual extends BinaryPredicate<number> {
  public describe(actual: number): string {
    return `${actual} >= ${this.expected}`;
  }

  public test(actual: number): boolean {
    return actual >= this.expected;
  }
}

class JestIsGreaterThanOrEqual extends IsGreaterThanOrEqual {
  public assert(actual: number): void {
    expect(actual).toBeGreaterThanOrEqual(this.expected);
  }
}

class IsLessThan extends BinaryPredicate<number> {
  public describe(actual: number): string {
    return `${actual} < ${this.expected}`;
  }

  public test(actual: number): boolean {
    return actual < this.expected;
  }
}

class JestIsLessThan extends IsLessThan {
  public assert(actual: number): void {
    expect(actual).toBeLessThan(this.expected);
  }
}

class IsLessThanOrEqual extends BinaryPredicate<number> {
  public describe(actual: number): string {
    return `${actual} <= ${this.expected}`;
  }

  public test(actual: number): boolean {
    return actual <= this.expected;
  }
}

class JestIsLessThanOrEqual extends IsLessThanOrEqual {
  public assert(actual: number): void {
    expect(actual).toBeLessThanOrEqual(this.expected);
  }
}

class Includes extends BinaryPredicate<string> {
  public describe(actual: string): string {
    return `${serialize(actual)} =~ ${serialize(this.expected)}`;
  }

  public test(actual: string): boolean {
    return actual.includes(this.expected);
  }
}

class JestIncludes extends Includes {
  public assert(actual: string): void {
    expect(actual).toContain(this.expected);
  }
}

class NotIncludes extends Includes {
  public describe(actual: string): string {
    return `${serialize(actual)} !~ ${serialize(this.expected)}`;
  }

  public test(actual: string): boolean {
    return !super.test(actual);
  }
}

class JestNotIncludes extends NotIncludes {
  public assert(actual: string): void {
    expect(actual).not.toContain(this.expected);
  }
}

class Matches extends BinaryPredicate<string, RegExp> {
  public describe(actual: string): string {
    return `${serialize(actual)} =~ ${serialize(this.expected)}`;
  }

  public test(actual: string): boolean {
    return this.expected.test(actual);
  }
}

class JestMatches extends Matches {
  public assert(actual: string): void {
    expect(actual).toMatch(this.expected);
  }
}

class NotMatches extends Matches {
  public describe(actual: string): string {
    return `${serialize(actual)} !~ ${serialize(this.expected)}`;
  }

  public test(actual: string): boolean {
    return !super.test(actual);
  }
}

class JestNotMatches extends NotMatches {
  public assert(actual: string): void {
    expect(actual).not.toMatch(this.expected);
  }
}
