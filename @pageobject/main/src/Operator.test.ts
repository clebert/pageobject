// tslint:disable no-any

import {Operator} from '.';

class FalsyOperator implements Operator<any> {
  public describe(valueName: string): string {
    return `(${valueName} is falsy)`;
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
    return `(${valueName} is truthy)`;
  }

  public test(value: any): boolean {
    return Boolean(value);
  }
}

function truthy(): Operator<any> {
  return new TruthyOperator();
}

describe('Operator', () => {
  describe('not() => Operator', () => {
    describe('describe()', () => {
      it('should return a description', () => {
        expect(Operator.not(falsy()).describe('valueName')).toBe(
          '!(valueName is falsy)'
        );
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(Operator.not(falsy()).test(1)).toBe(true);
        expect(Operator.not(truthy()).test(0)).toBe(true);
      });

      it('should return false', () => {
        expect(Operator.not(falsy()).test(0)).toBe(false);
        expect(Operator.not(truthy()).test(1)).toBe(false);
      });
    });
  });

  describe('and() => Operator', () => {
    describe('describe()', () => {
      it('should return a description', () => {
        expect(Operator.and(falsy(), truthy()).describe('valueName')).toBe(
          '((valueName is falsy) && (valueName is truthy))'
        );
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(Operator.and(falsy(), falsy()).test(0)).toBe(true);
        expect(Operator.and(truthy(), truthy()).test(1)).toBe(true);
      });

      it('should return false', () => {
        expect(Operator.and(falsy(), falsy()).test(1)).toBe(false);

        expect(Operator.and(falsy(), truthy()).test(0)).toBe(false);
        expect(Operator.and(falsy(), truthy()).test(1)).toBe(false);

        expect(Operator.and(truthy(), falsy()).test(0)).toBe(false);
        expect(Operator.and(truthy(), falsy()).test(1)).toBe(false);

        expect(Operator.and(truthy(), truthy()).test(0)).toBe(false);
      });
    });
  });

  describe('or() => Operator', () => {
    describe('describe()', () => {
      it('should return a description', () => {
        expect(Operator.or(falsy(), truthy()).describe('valueName')).toBe(
          '((valueName is falsy) || (valueName is truthy))'
        );
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(Operator.or(falsy(), falsy()).test(0)).toBe(true);

        expect(Operator.or(falsy(), truthy()).test(0)).toBe(true);
        expect(Operator.or(falsy(), truthy()).test(1)).toBe(true);

        expect(Operator.or(truthy(), falsy()).test(0)).toBe(true);
        expect(Operator.or(truthy(), falsy()).test(1)).toBe(true);

        expect(Operator.or(truthy(), truthy()).test(1)).toBe(true);
      });

      it('should return false', () => {
        expect(Operator.or(falsy(), falsy()).test(1)).toBe(false);
        expect(Operator.or(truthy(), truthy()).test(0)).toBe(false);
      });
    });
  });

  describe('equals() => Operator', () => {
    const operator = Operator.equals('foo');

    describe('describe()', () => {
      it('should return a description', () => {
        expect(operator.describe('valueName')).toBe("(valueName == 'foo')");
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(operator.test('foo')).toBe(true);
        expect(Operator.equals({}).test({})).toBe(true);
      });

      it('should return false', () => {
        expect(operator.test('foobar')).toBe(false);
        expect(operator.test('bar')).toBe(false);
        expect(Operator.equals({}).test([])).toBe(false);
      });
    });
  });

  describe('greaterThan() => Operator', () => {
    const operator = Operator.greaterThan(1);

    describe('describe()', () => {
      it('should return a description', () => {
        expect(operator.describe('valueName')).toBe('(valueName > 1)');
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

  describe('greaterThanOrEquals() => Operator', () => {
    const operator = Operator.greaterThanOrEquals(1);

    describe('describe()', () => {
      it('should return a description', () => {
        expect(operator.describe('valueName')).toBe('(valueName >= 1)');
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

  describe('lessThan() => Operator', () => {
    const operator = Operator.lessThan(1);

    describe('describe()', () => {
      it('should return a description', () => {
        expect(operator.describe('valueName')).toBe('(valueName < 1)');
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

  describe('lessThanOrEquals() => Operator', () => {
    const operator = Operator.lessThanOrEquals(1);

    describe('describe()', () => {
      it('should return a description', () => {
        expect(operator.describe('valueName')).toBe('(valueName <= 1)');
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

  describe('matches() => Operator', () => {
    const operator = Operator.matches(/foo/);

    describe('describe()', () => {
      it('should return a description', () => {
        expect(operator.describe('valueName')).toBe('(valueName =~ /foo/)');
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
