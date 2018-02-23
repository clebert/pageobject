/* tslint:disable no-any */

import {Operator, and, not, or} from '.';

class FalsyOperator implements Operator<any> {
  public describe(valueName: string): string {
    return `(${valueName} IS FALSY)`;
  }

  public test(value: any): boolean {
    return !Boolean(value);
  }
}

function falsy(): Operator<any> {
  return new FalsyOperator();
}

class TruthyOperator implements Operator<any> {
  public describe(valueName: string): string {
    return `(${valueName} IS TRUTHY)`;
  }

  public test(value: any): boolean {
    return Boolean(value);
  }
}

function truthy(): Operator<any> {
  return new TruthyOperator();
}

describe('and()', () => {
  describe('describe()', () => {
    it('should return a description', () => {
      expect(and(falsy(), truthy()).describe('valueName')).toBe(
        '((valueName IS FALSY) AND (valueName IS TRUTHY))'
      );
    });
  });

  describe('test()', () => {
    it('should return true', () => {
      expect(and(falsy(), falsy()).test(0)).toBe(true);
      expect(and(truthy(), truthy()).test(1)).toBe(true);
    });

    it('should return false', () => {
      expect(and(falsy(), falsy()).test(1)).toBe(false);

      expect(and(falsy(), truthy()).test(0)).toBe(false);
      expect(and(falsy(), truthy()).test(1)).toBe(false);

      expect(and(truthy(), falsy()).test(0)).toBe(false);
      expect(and(truthy(), falsy()).test(1)).toBe(false);

      expect(and(truthy(), truthy()).test(0)).toBe(false);
    });
  });
});

describe('or()', () => {
  describe('describe()', () => {
    it('should return a description', () => {
      expect(or(falsy(), truthy()).describe('valueName')).toBe(
        '((valueName IS FALSY) OR (valueName IS TRUTHY))'
      );
    });
  });

  describe('test()', () => {
    it('should return true', () => {
      expect(or(falsy(), falsy()).test(0)).toBe(true);

      expect(or(falsy(), truthy()).test(0)).toBe(true);
      expect(or(falsy(), truthy()).test(1)).toBe(true);

      expect(or(truthy(), falsy()).test(0)).toBe(true);
      expect(or(truthy(), falsy()).test(1)).toBe(true);

      expect(or(truthy(), truthy()).test(1)).toBe(true);
    });

    it('should return false', () => {
      expect(or(falsy(), falsy()).test(1)).toBe(false);
      expect(or(truthy(), truthy()).test(0)).toBe(false);
    });
  });
});

describe('not()', () => {
  describe('describe()', () => {
    it('should return a description', () => {
      expect(not(falsy()).describe('valueName')).toBe(
        '(NOT (valueName IS FALSY))'
      );
    });
  });

  describe('test()', () => {
    it('should return true', () => {
      expect(not(falsy()).test(1)).toBe(true);
      expect(not(truthy()).test(0)).toBe(true);
    });

    it('should return false', () => {
      expect(not(falsy()).test(0)).toBe(false);
      expect(not(truthy()).test(1)).toBe(false);
    });
  });
});
