export type Predicate<TValue> = (actual: TValue) => boolean;

export function equals<TValue>(expected: TValue): Predicate<TValue> {
  return actual => actual === expected;
}

export function greaterThan(expected: number): Predicate<number> {
  return actual => actual > expected;
}

export function greaterThanOrEquals(expected: number): Predicate<number> {
  return actual => actual >= expected;
}

export function lessThan(expected: number): Predicate<number> {
  return actual => actual < expected;
}

export function lessThanOrEquals(expected: number): Predicate<number> {
  return actual => actual <= expected;
}

export function matches(expected: RegExp): Predicate<string> {
  return actual => expected.test(actual);
}

export function includes(expected: string): Predicate<string> {
  return actual => actual.includes(expected);
}

export function startsWith(expected: string): Predicate<string> {
  return actual => actual.startsWith(expected);
}

export function endsWith(expected: string): Predicate<string> {
  return actual => actual.endsWith(expected);
}

export function not<TValue>(a: Predicate<TValue>): Predicate<TValue> {
  return actual => !a(actual);
}

export function and<TValue>(
  a: Predicate<TValue>,
  b: Predicate<TValue>
): Predicate<TValue> {
  return actual => a(actual) && b(actual);
}

export function or<TValue>(
  a: Predicate<TValue>,
  b: Predicate<TValue>
): Predicate<TValue> {
  return actual => a(actual) || b(actual);
}
