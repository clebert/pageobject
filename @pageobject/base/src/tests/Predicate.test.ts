import {Predicate} from '..';

describe('Predicate', () => {
  describe('is() => Predicate', () => {
    const factory = Predicate.is;

    describe('describe()', () => {
      it('should return the default description', () => {
        expect(factory('foo').describe('bar')).toBe("'bar' === 'foo'");
      });

      it('should return a custom description', () => {
        expect(factory('foo').describe('bar', '<value>')).toBe(
          "(<value> = 'bar') === 'foo'"
        );
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

    describe('describe()', () => {
      it('should return the default description', () => {
        expect(factory('foo').describe('bar')).toBe("'bar' !== 'foo'");
      });

      it('should return a custom description', () => {
        expect(factory('foo').describe('bar', '<value>')).toBe(
          "(<value> = 'bar') !== 'foo'"
        );
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

    describe('describe()', () => {
      it('should return the default description', () => {
        expect(factory(0).describe(1)).toBe('1 > 0');
      });

      it('should return a custom description', () => {
        expect(factory(0).describe(1, '<value>')).toBe('(<value> = 1) > 0');
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

  describe('isGreaterThanOrEqual() => Predicate', () => {
    const factory = Predicate.isGreaterThanOrEqual;

    describe('describe()', () => {
      it('should return the default description', () => {
        expect(factory(0).describe(1)).toBe('1 >= 0');
      });

      it('should return a custom description', () => {
        expect(factory(0).describe(1, '<value>')).toBe('(<value> = 1) >= 0');
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

    describe('describe()', () => {
      it('should return the default description', () => {
        expect(factory(0).describe(1)).toBe('1 < 0');
      });

      it('should return a custom description', () => {
        expect(factory(0).describe(1, '<value>')).toBe('(<value> = 1) < 0');
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

  describe('isLessThanOrEqual() => Predicate', () => {
    const factory = Predicate.isLessThanOrEqual;

    describe('describe()', () => {
      it('should return the default description', () => {
        expect(factory(0).describe(1)).toBe('1 <= 0');
      });

      it('should return a custom description', () => {
        expect(factory(0).describe(1, '<value>')).toBe('(<value> = 1) <= 0');
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

    describe('describe()', () => {
      it('should return the default description', () => {
        expect(factory('foo').describe('bar')).toBe("'bar' =~ 'foo'");
      });

      it('should return a custom description', () => {
        expect(factory('foo').describe('bar', '<value>')).toBe(
          "(<value> = 'bar') =~ 'foo'"
        );
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

    describe('describe()', () => {
      it('should return the default description', () => {
        expect(factory('foo').describe('bar')).toBe("'bar' !~ 'foo'");
      });

      it('should return a custom description', () => {
        expect(factory('foo').describe('bar', '<value>')).toBe(
          "(<value> = 'bar') !~ 'foo'"
        );
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

    describe('describe()', () => {
      it('should return the default description', () => {
        expect(factory(/foo/).describe('bar')).toBe("'bar' =~ /foo/");
      });

      it('should return a custom description', () => {
        expect(factory(/foo/).describe('bar', '<value>')).toBe(
          "(<value> = 'bar') =~ /foo/"
        );
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

    describe('describe()', () => {
      it('should return the default description', () => {
        expect(factory(/foo/).describe('bar')).toBe("'bar' !~ /foo/");
      });

      it('should return a custom description', () => {
        expect(factory(/foo/).describe('bar', '<value>')).toBe(
          "(<value> = 'bar') !~ /foo/"
        );
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
