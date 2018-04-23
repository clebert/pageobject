import {Predicate} from '..';

interface JestGlobal {
  expect?: typeof expect;
}

function noJest(effect: () => void): () => void {
  const jestGlobal = global as JestGlobal;

  return () => {
    const expect = jestGlobal.expect;

    try {
      jestGlobal.expect = undefined;

      effect();
    } finally {
      jestGlobal.expect = expect;
    }
  };
}

describe('Predicate', () => {
  describe('is() => Predicate', () => {
    const factory = Predicate.is;

    describe('assert()', () => {
      it('should not throw a node-assertion error', () => {
        expect(noJest(() => factory('foo').assert('foo'))).not.toThrow();
      });

      it('should throw a node-assertion error', () => {
        expect(noJest(() => factory('foo').assert('foobar'))).toThrow(
          "'foobar' === 'foo'"
        );

        expect(noJest(() => factory('foo').assert('bar'))).toThrow(
          "'bar' === 'foo'"
        );

        expect(noJest(() => factory('foo').assert('barfoo'))).toThrow(
          "'barfoo' === 'foo'"
        );
      });

      it('should not throw a jest-assertion error', () => {
        expect(() => factory('foo').assert('foo')).not.toThrow();
      });

      it('should throw a jest-assertion error', () => {
        const message = 'Expected value to be:';

        expect(() => factory('foo').assert('foobar')).toThrow(message);
        expect(() => factory('foo').assert('bar')).toThrow(message);
        expect(() => factory('foo').assert('barfoo')).toThrow(message);
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(factory('foo').test('foo')).toBe(true);
      });

      it('should return false', () => {
        expect(factory('foo').test('foobar')).toBe(false);
        expect(factory('foo').test('bar')).toBe(false);
        expect(factory('foo').test('barfoo')).toBe(false);
      });
    });
  });

  describe('isNot() => Predicate', () => {
    const factory = Predicate.isNot;

    describe('assert()', () => {
      it('should not throw a node-assertion error', () => {
        expect(noJest(() => factory('foo').assert('foobar'))).not.toThrow();
        expect(noJest(() => factory('foo').assert('bar'))).not.toThrow();
        expect(noJest(() => factory('foo').assert('barfoo'))).not.toThrow();
      });

      it('should throw a node-assertion error', () => {
        expect(noJest(() => factory('foo').assert('foo'))).toThrow(
          "'foo' !== 'foo'"
        );
      });

      it('should not throw a jest-assertion error', () => {
        expect(() => factory('foo').assert('foobar')).not.toThrow();
        expect(() => factory('foo').assert('bar')).not.toThrow();
        expect(() => factory('foo').assert('barfoo')).not.toThrow();
      });

      it('should throw a jest-assertion error', () => {
        const message = 'Expected value to not be:';

        expect(() => factory('foo').assert('foo')).toThrow(message);
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(factory('foo').test('foobar')).toBe(true);
        expect(factory('foo').test('bar')).toBe(true);
        expect(factory('foo').test('barfoo')).toBe(true);
      });

      it('should return false', () => {
        expect(factory('foo').test('foo')).toBe(false);
      });
    });
  });

  describe('isGreaterThan() => Predicate', () => {
    const factory = Predicate.isGreaterThan;

    describe('assert()', () => {
      it('should not throw a node-assertion error', () => {
        expect(noJest(() => factory(0).assert(1))).not.toThrow();
      });

      it('should throw a node-assertion error', () => {
        expect(noJest(() => factory(0).assert(-1))).toThrow('-1 > 0');
        expect(noJest(() => factory(0).assert(0))).toThrow('0 > 0');
      });

      it('should not throw a jest-assertion error', () => {
        expect(() => factory(0).assert(1)).not.toThrow();
      });

      it('should throw a jest-assertion error', () => {
        const message = 'Expected value to be greater than:';

        expect(() => factory(0).assert(-1)).toThrow(message);
        expect(() => factory(0).assert(0)).toThrow(message);
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(factory(0).test(1)).toBe(true);
      });

      it('should return false', () => {
        expect(factory(0).test(-1)).toBe(false);
        expect(factory(0).test(0)).toBe(false);
      });
    });
  });

  describe('isGreaterThanOrEquals() => Predicate', () => {
    const factory = Predicate.isGreaterThanOrEquals;

    describe('assert()', () => {
      it('should not throw a node-assertion error', () => {
        expect(noJest(() => factory(0).assert(0))).not.toThrow();
        expect(noJest(() => factory(0).assert(1))).not.toThrow();
      });

      it('should throw a node-assertion error', () => {
        expect(noJest(() => factory(0).assert(-1))).toThrow('-1 >= 0');
      });

      it('should not throw a jest-assertion error', () => {
        expect(() => factory(0).assert(0)).not.toThrow();
        expect(() => factory(0).assert(1)).not.toThrow();
      });

      it('should throw a jest-assertion error', () => {
        const message = 'Expected value to be greater than or equal:';

        expect(() => factory(0).assert(-1)).toThrow(message);
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(factory(0).test(0)).toBe(true);
        expect(factory(0).test(1)).toBe(true);
      });

      it('should return false', () => {
        expect(factory(0).test(-1)).toBe(false);
      });
    });
  });

  describe('isLessThan() => Predicate', () => {
    const factory = Predicate.isLessThan;

    describe('assert()', () => {
      it('should not throw a node-assertion error', () => {
        expect(noJest(() => factory(0).assert(-1))).not.toThrow();
      });

      it('should throw a node-assertion error', () => {
        expect(noJest(() => factory(0).assert(0))).toThrow('0 < 0');
        expect(noJest(() => factory(0).assert(1))).toThrow('1 < 0');
      });

      it('should not throw a jest-assertion error', () => {
        expect(() => factory(0).assert(-1)).not.toThrow();
      });

      it('should throw a jest-assertion error', () => {
        const message = 'Expected value to be less than:';

        expect(() => factory(0).assert(0)).toThrow(message);
        expect(() => factory(0).assert(1)).toThrow(message);
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(factory(0).test(-1)).toBe(true);
      });

      it('should return false', () => {
        expect(factory(0).test(0)).toBe(false);
        expect(factory(0).test(1)).toBe(false);
      });
    });
  });

  describe('isLessThanOrEquals() => Predicate', () => {
    const factory = Predicate.isLessThanOrEquals;

    describe('assert()', () => {
      it('should not throw a node-assertion error', () => {
        expect(noJest(() => factory(0).assert(-1))).not.toThrow();
        expect(noJest(() => factory(0).assert(0))).not.toThrow();
      });

      it('should throw a node-assertion error', () => {
        expect(noJest(() => factory(0).assert(1))).toThrow('1 <= 0');
      });

      it('should not throw a jest-assertion error', () => {
        expect(() => factory(0).assert(-1)).not.toThrow();
        expect(() => factory(0).assert(0)).not.toThrow();
      });

      it('should throw a jest-assertion error', () => {
        const message = 'Expected value to be less than or equal:';

        expect(() => factory(0).assert(1)).toThrow(message);
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(factory(0).test(-1)).toBe(true);
        expect(factory(0).test(0)).toBe(true);
      });

      it('should return false', () => {
        expect(factory(0).test(1)).toBe(false);
      });
    });
  });

  describe('includes() => Predicate', () => {
    const factory = Predicate.includes;

    describe('assert()', () => {
      it('should not throw a node-assertion error', () => {
        expect(noJest(() => factory('foo').assert('foo'))).not.toThrow();
        expect(noJest(() => factory('foo').assert('foobar'))).not.toThrow();
        expect(noJest(() => factory('foo').assert('barfoo'))).not.toThrow();
      });

      it('should throw a node-assertion error', () => {
        expect(noJest(() => factory('foo').assert('bar'))).toThrow(
          "'bar' =~ 'foo'"
        );
      });

      it('should not throw a jest-assertion error', () => {
        expect(() => factory('foo').assert('foo')).not.toThrow();
        expect(() => factory('foo').assert('foobar')).not.toThrow();
        expect(() => factory('foo').assert('barfoo')).not.toThrow();
      });

      it('should throw a jest-assertion error', () => {
        const message = 'To contain value:';

        expect(() => factory('foo').assert('bar')).toThrow(message);
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(factory('foo').test('foo')).toBe(true);
        expect(factory('foo').test('foobar')).toBe(true);
        expect(factory('foo').test('barfoo')).toBe(true);
      });

      it('should return false', () => {
        expect(factory('foo').test('bar')).toBe(false);
      });
    });
  });

  describe('notIncludes() => Predicate', () => {
    const factory = Predicate.notIncludes;

    describe('assert()', () => {
      it('should not throw a node-assertion error', () => {
        expect(noJest(() => factory('foo').assert('bar'))).not.toThrow();
      });

      it('should throw a node-assertion error', () => {
        expect(noJest(() => factory('foo').assert('foo'))).toThrow(
          "'foo' !~ 'foo'"
        );

        expect(noJest(() => factory('foo').assert('foobar'))).toThrow(
          "'foobar' !~ 'foo'"
        );

        expect(noJest(() => factory('foo').assert('barfoo'))).toThrow(
          "'barfoo' !~ 'foo'"
        );
      });

      it('should not throw a jest-assertion error', () => {
        expect(() => factory('foo').assert('bar')).not.toThrow();
      });

      it('should throw a jest-assertion error', () => {
        const message = 'Not to contain value:';

        expect(() => factory('foo').assert('foo')).toThrow(message);
        expect(() => factory('foo').assert('foobar')).toThrow(message);
        expect(() => factory('foo').assert('barfoo')).toThrow(message);
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(factory('foo').test('bar')).toBe(true);
      });

      it('should return false', () => {
        expect(factory('foo').test('foo')).toBe(false);
        expect(factory('foo').test('foobar')).toBe(false);
        expect(factory('foo').test('barfoo')).toBe(false);
      });
    });
  });

  describe('matches() => Predicate', () => {
    const factory = Predicate.matches;

    describe('assert()', () => {
      it('should not throw a node-assertion error', () => {
        expect(noJest(() => factory(/foo/).assert('foo'))).not.toThrow();
        expect(noJest(() => factory(/foo/).assert('foobar'))).not.toThrow();
        expect(noJest(() => factory(/foo/).assert('barfoo'))).not.toThrow();
      });

      it('should throw a node-assertion error', () => {
        expect(noJest(() => factory(/foo/).assert('bar'))).toThrow(
          "'bar' =~ /foo/"
        );
      });

      it('should not throw a jest-assertion error', () => {
        expect(() => factory(/foo/).assert('foo')).not.toThrow();
        expect(() => factory(/foo/).assert('foobar')).not.toThrow();
        expect(() => factory(/foo/).assert('barfoo')).not.toThrow();
      });

      it('should throw a jest-assertion error', () => {
        const message = 'Expected value to match:';

        expect(() => factory(/foo/).assert('bar')).toThrow(message);
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(factory(/foo/).test('foo')).toBe(true);
        expect(factory(/foo/).test('foobar')).toBe(true);
        expect(factory(/foo/).test('barfoo')).toBe(true);
      });

      it('should return false', () => {
        expect(factory(/foo/).test('bar')).toBe(false);
      });
    });
  });

  describe('notMatches() => Predicate', () => {
    const factory = Predicate.notMatches;

    describe('assert()', () => {
      it('should not throw a node-assertion error', () => {
        expect(noJest(() => factory(/foo/).assert('bar'))).not.toThrow();
      });

      it('should throw a node-assertion error', () => {
        expect(noJest(() => factory(/foo/).assert('foo'))).toThrow(
          "'foo' !~ /foo/"
        );

        expect(noJest(() => factory(/foo/).assert('foobar'))).toThrow(
          "'foobar' !~ /foo/"
        );

        expect(noJest(() => factory(/foo/).assert('barfoo'))).toThrow(
          "'barfoo' !~ /foo/"
        );
      });

      it('should not throw a jest-assertion error', () => {
        expect(() => factory(/foo/).assert('bar')).not.toThrow();
      });

      it('should throw a jest-assertion error', () => {
        const message = 'Expected value not to match:';

        expect(() => factory(/foo/).assert('foo')).toThrow(message);
        expect(() => factory(/foo/).assert('foobar')).toThrow(message);
        expect(() => factory(/foo/).assert('barfoo')).toThrow(message);
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        expect(factory(/foo/).test('bar')).toBe(true);
      });

      it('should return false', () => {
        expect(factory(/foo/).test('foo')).toBe(false);
        expect(factory(/foo/).test('foobar')).toBe(false);
        expect(factory(/foo/).test('barfoo')).toBe(false);
      });
    });
  });
});
