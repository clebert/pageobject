/* tslint:disable no-any */

import {
  equals,
  greaterThan,
  greaterThanOrEquals,
  lessThan,
  lessThanOrEquals,
  matches
} from '.';

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
      expect(operator.describe('valueName')).toBe('(valueName GREATER THAN 1)');
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
      expect(operator.describe('valueName')).toBe('(valueName MATCHES /foo/)');
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
