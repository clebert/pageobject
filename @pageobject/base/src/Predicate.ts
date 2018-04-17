// tslint:disable no-use-before-declare

import {notStrictEqual, ok, strictEqual} from 'assert';
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
    return new Is(expected);
  }

  public static isNot<TValue>(expected: TValue): Predicate<TValue> {
    return new IsNot(expected);
  }

  public static isGreaterThan(expected: number): Predicate<number> {
    return new IsGreaterThan(expected);
  }

  public static isGreaterThanOrEquals(expected: number): Predicate<number> {
    return new IsGreaterThanOrEquals(expected);
  }

  public static isLessThan(expected: number): Predicate<number> {
    return new IsLessThan(expected);
  }

  public static isLessThanOrEquals(expected: number): Predicate<number> {
    return new IsLessThanOrEquals(expected);
  }

  public static matches(expected: RegExp): Predicate<string> {
    return new Matches(expected);
  }

  public static notMatches(expected: RegExp): Predicate<string> {
    return new NotMatches(expected);
  }

  public abstract assert(actual: TValue): void;
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
  public assert(actual: TValue): void {
    if (useJest()) {
      expect(actual).toBe(this.expected);
    } else {
      strictEqual(actual, this.expected);
    }
  }

  public test(actual: TValue): boolean {
    return actual === this.expected;
  }
}

class IsNot<TValue> extends BinaryPredicate<TValue> {
  public assert(actual: TValue): void {
    if (useJest()) {
      expect(actual).not.toBe(this.expected);
    } else {
      notStrictEqual(actual, this.expected);
    }
  }

  public test(actual: TValue): boolean {
    return actual !== this.expected;
  }
}

class IsGreaterThan extends BinaryPredicate<number> {
  public assert(actual: number): void {
    if (useJest()) {
      expect(actual).toBeGreaterThan(this.expected);
    } else {
      ok(this.test(actual), `${actual} > ${this.expected}`);
    }
  }

  public test(actual: number): boolean {
    return actual > this.expected;
  }
}

class IsGreaterThanOrEquals extends BinaryPredicate<number> {
  public assert(actual: number): void {
    if (useJest()) {
      expect(actual).toBeGreaterThanOrEqual(this.expected);
    } else {
      ok(this.test(actual), `${actual} >= ${this.expected}`);
    }
  }

  public test(actual: number): boolean {
    return actual >= this.expected;
  }
}

class IsLessThan extends BinaryPredicate<number> {
  public assert(actual: number): void {
    if (useJest()) {
      expect(actual).toBeLessThan(this.expected);
    } else {
      ok(this.test(actual), `${actual} < ${this.expected}`);
    }
  }

  public test(actual: number): boolean {
    return actual < this.expected;
  }
}

class IsLessThanOrEquals extends BinaryPredicate<number> {
  public assert(actual: number): void {
    if (useJest()) {
      expect(actual).toBeLessThanOrEqual(this.expected);
    } else {
      ok(this.test(actual), `${actual} <= ${this.expected}`);
    }
  }

  public test(actual: number): boolean {
    return actual <= this.expected;
  }
}

class Matches extends BinaryPredicate<string, RegExp> {
  public assert(actual: string): void {
    const message = `${serialize(actual)} =~ ${serialize(this.expected)}`;

    if (useJest()) {
      expect(actual).toMatch(this.expected);
    } else {
      ok(this.test(actual), message);
    }
  }

  public test(actual: string): boolean {
    return this.expected.test(actual);
  }
}

class NotMatches extends BinaryPredicate<string, RegExp> {
  public assert(actual: string): void {
    const message = `${serialize(actual)} !~ ${serialize(this.expected)}`;

    if (useJest()) {
      expect(actual).not.toMatch(this.expected);
    } else {
      ok(this.test(actual), message);
    }
  }

  public test(actual: string): boolean {
    return !this.expected.test(actual);
  }
}
