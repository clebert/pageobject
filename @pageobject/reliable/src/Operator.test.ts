/* tslint:disable no-any */

import {
  Operator,
  and,
  equals,
  greaterThan,
  greaterThanOrEquals,
  lessThan,
  lessThanOrEquals,
  matches,
  not,
  or
} from '.';

describe('LogicalOperator', () => {
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
});

describe('RelationalOperator', () => {
  describe('equals()', () => {
    const operator = equals('foo');

    describe('describe()', () => {
      it('should return a description', () => {
        expect(operator.describe('valueName')).toBe("(valueName EQUALS 'foo')");
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(operator.test('foo')).toBe(true);
      });

      it('should return false', () => {
        expect(operator.test('foobar')).toBe(false);
        expect(operator.test('bar')).toBe(false);
      });
    });
  });

  describe('greaterThan()', () => {
    const operator = greaterThan(1);

    describe('describe()', () => {
      it('should return a description', () => {
        expect(operator.describe('valueName')).toBe(
          '(valueName GREATER THAN 1)'
        );
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(operator.test(2)).toBe(true);
      });

      it('should return false', () => {
        expect(operator.test(0)).toBe(false);
        expect(operator.test(1)).toBe(false);
      });
    });
  });

  describe('greaterThanOrEquals()', () => {
    const operator = greaterThanOrEquals(1);

    describe('describe()', () => {
      it('should return a description', () => {
        expect(operator.describe('valueName')).toBe(
          '(valueName GREATER THAN OR EQUALS 1)'
        );
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(operator.test(1)).toBe(true);
        expect(operator.test(2)).toBe(true);
      });

      it('should return false', () => {
        expect(operator.test(0)).toBe(false);
      });
    });
  });

  describe('lessThan()', () => {
    const operator = lessThan(1);

    describe('describe()', () => {
      it('should return a description', () => {
        expect(operator.describe('valueName')).toBe('(valueName LESS THAN 1)');
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(operator.test(0)).toBe(true);
      });

      it('should return false', () => {
        expect(operator.test(1)).toBe(false);
        expect(operator.test(2)).toBe(false);
      });
    });
  });

  describe('lessThanOrEquals()', () => {
    const operator = lessThanOrEquals(1);

    describe('describe()', () => {
      it('should return a description', () => {
        expect(operator.describe('valueName')).toBe(
          '(valueName LESS THAN OR EQUALS 1)'
        );
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(operator.test(0)).toBe(true);
        expect(operator.test(1)).toBe(true);
      });

      it('should return false', () => {
        expect(operator.test(2)).toBe(false);
      });
    });
  });

  describe('matches()', () => {
    const operator = matches(/foo/);

    describe('describe()', () => {
      it('should return a description', () => {
        expect(operator.describe('valueName')).toBe(
          '(valueName MATCHES /foo/)'
        );
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(operator.test('foo')).toBe(true);
        expect(operator.test('foobar')).toBe(true);
      });

      it('should return false', () => {
        expect(operator.test('bar')).toBe(false);
      });
    });
  });
});
