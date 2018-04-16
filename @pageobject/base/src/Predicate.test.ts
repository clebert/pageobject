import {
  and,
  endsWith,
  equals,
  greaterThan,
  greaterThanOrEquals,
  includes,
  lessThan,
  lessThanOrEquals,
  matches,
  not,
  or,
  startsWith
} from '.';

const identity = (value: boolean) => value;

describe('Predicate', () => {
  describe('equals()', () => {
    it('should return true', () => {
      expect(equals(0)(0)).toBe(true);

      expect(equals('foo')('foo')).toBe(true);
    });

    it('should return false', () => {
      expect(equals(0)(-1)).toBe(false);
      expect(equals(0)(1)).toBe(false);

      expect(equals('foo')('foobar')).toBe(false);
      expect(equals('foo')('bar')).toBe(false);
      expect(equals('foo')('barfoo')).toBe(false);
    });
  });

  describe('greaterThan()', () => {
    it('should return true', () => {
      expect(greaterThan(0)(1)).toBe(true);
    });

    it('should return false', () => {
      expect(greaterThan(0)(-1)).toBe(false);
      expect(greaterThan(0)(0)).toBe(false);
    });
  });

  describe('greaterThanOrEquals()', () => {
    it('should return true', () => {
      expect(greaterThanOrEquals(0)(0)).toBe(true);
      expect(greaterThanOrEquals(0)(1)).toBe(true);
    });

    it('should return false', () => {
      expect(greaterThanOrEquals(0)(-1)).toBe(false);
    });
  });

  describe('lessThan()', () => {
    it('should return true', () => {
      expect(lessThan(0)(-1)).toBe(true);
    });

    it('should return false', () => {
      expect(lessThan(0)(0)).toBe(false);
      expect(lessThan(0)(1)).toBe(false);
    });
  });

  describe('lessThanOrEquals()', () => {
    it('should return true', () => {
      expect(lessThanOrEquals(0)(-1)).toBe(true);
      expect(lessThanOrEquals(0)(0)).toBe(true);
    });

    it('should return false', () => {
      expect(lessThanOrEquals(0)(1)).toBe(false);
    });
  });

  describe('matches()', () => {
    it('should return true', () => {
      expect(matches(/foo/)('foo')).toBe(true);
      expect(matches(/foo/)('foobar')).toBe(true);
      expect(matches(/foo/)('barfoo')).toBe(true);
    });

    it('should return false', () => {
      expect(matches(/foo/)('bar')).toBe(false);
    });
  });

  describe('includes()', () => {
    it('should return true', () => {
      expect(includes('foo')('foo')).toBe(true);
      expect(includes('foo')('foobar')).toBe(true);
      expect(includes('foo')('barfoo')).toBe(true);
    });

    it('should return false', () => {
      expect(includes('foo')('bar')).toBe(false);
    });
  });

  describe('startsWith()', () => {
    it('should return true', () => {
      expect(startsWith('foo')('foo')).toBe(true);
      expect(startsWith('foo')('foobar')).toBe(true);
    });

    it('should return false', () => {
      expect(startsWith('foo')('bar')).toBe(false);
      expect(startsWith('foo')('barfoo')).toBe(false);
    });
  });

  describe('endsWith()', () => {
    it('should return true', () => {
      expect(endsWith('foo')('foo')).toBe(true);
      expect(endsWith('foo')('barfoo')).toBe(true);
    });

    it('should return false', () => {
      expect(endsWith('foo')('foobar')).toBe(false);
      expect(endsWith('foo')('bar')).toBe(false);
    });
  });

  describe('not()', () => {
    it('should return true', () => {
      expect(not(identity)(false)).toBe(true);
    });

    it('should return false', () => {
      expect(not(identity)(true)).toBe(false);
    });
  });

  describe('and()', () => {
    it('should return true', () => {
      expect(and(identity, identity)(true)).toBe(true);
    });

    it('should return false', () => {
      expect(and(identity, identity)(false)).toBe(false);
      expect(and(not(identity), identity)(true)).toBe(false);
      expect(and(not(identity), identity)(false)).toBe(false);
    });
  });

  describe('or()', () => {
    it('should return true', () => {
      expect(or(identity, identity)(true)).toBe(true);
      expect(or(not(identity), identity)(true)).toBe(true);
      expect(or(not(identity), identity)(false)).toBe(true);
    });

    it('should return false', () => {
      expect(or(identity, identity)(false)).toBe(false);
    });
  });
});
