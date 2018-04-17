import {Predicate} from '.';

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

const {
  is,
  isNot,
  isGreaterThan,
  isGreaterThanOrEquals,
  isLessThan,
  isLessThanOrEquals,
  matches,
  notMatches
} = Predicate;

const effectsIs = (
  predicateMethodName: keyof Predicate<number | string>,
  negated: boolean = false
) => {
  const predicateFactory = negated ? isNot : is;

  return {
    ok: [
      () => predicateFactory(0)[predicateMethodName](0),
      () => predicateFactory('foo')[predicateMethodName]('foo')
    ],
    nok: [
      () => predicateFactory(0)[predicateMethodName](-1),
      () => predicateFactory(0)[predicateMethodName](1),
      () => predicateFactory('foo')[predicateMethodName]('foobar'),
      () => predicateFactory('foo')[predicateMethodName]('bar'),
      () => predicateFactory('foo')[predicateMethodName]('barfoo')
    ]
  };
};

const effectsIsGreaterThan = (
  predicateMethodName: keyof Predicate<number>
) => ({
  ok: [() => isGreaterThan(0)[predicateMethodName](1)],
  nok: [
    () => isGreaterThan(0)[predicateMethodName](-1),
    () => isGreaterThan(0)[predicateMethodName](0)
  ]
});

const effectsIsGreaterThanOrEquals = (
  predicateMethodName: keyof Predicate<number>
) => ({
  ok: [
    () => isGreaterThanOrEquals(0)[predicateMethodName](0),
    () => isGreaterThanOrEquals(0)[predicateMethodName](1)
  ],
  nok: [() => isGreaterThanOrEquals(0)[predicateMethodName](-1)]
});

const effectsIsLessThan = (predicateMethodName: keyof Predicate<number>) => ({
  ok: [() => isLessThan(0)[predicateMethodName](-1)],
  nok: [
    () => isLessThan(0)[predicateMethodName](0),
    () => isLessThan(0)[predicateMethodName](1)
  ]
});

const effectsIsLessThanOrEquals = (
  predicateMethodName: keyof Predicate<number>
) => ({
  ok: [
    () => isLessThanOrEquals(0)[predicateMethodName](-1),
    () => isLessThanOrEquals(0)[predicateMethodName](0)
  ],
  nok: [() => isLessThanOrEquals(0)[predicateMethodName](1)]
});

const effectsMatches = (
  predicateMethodName: keyof Predicate<string>,
  negated: boolean = false
) => {
  const predicateFactory = negated ? notMatches : matches;

  return {
    ok: [
      () => predicateFactory(/foo/)[predicateMethodName]('foo'),
      () => predicateFactory(/foo/)[predicateMethodName]('foobar'),
      () => predicateFactory(/foo/)[predicateMethodName]('barfoo')
    ],
    nok: [() => predicateFactory(/foo/)[predicateMethodName]('bar')]
  };
};

describe('Predicate', () => {
  describe('is() => Predicate', () => {
    describe('assert()', () => {
      it('should not throw a jest error', () => {
        for (const effect of effectsIs('assert').ok) {
          expect(effect).not.toThrow();
        }
      });

      it('should throw a jest error', () => {
        for (const effect of effectsIs('assert').nok) {
          expect(effect).toThrow('Expected value to be:');
        }
      });

      it('should not throw a node error', () => {
        for (const effect of effectsIs('assert').ok) {
          expect(noJest(effect)).not.toThrow();
        }
      });

      it('should throw a node error', () => {
        for (const effect of effectsIs('assert').nok) {
          expect(noJest(effect)).toThrow(' === ');
        }
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        for (const effect of effectsIs('test').ok) {
          expect(effect()).toBe(true);
        }
      });

      it('should return false', () => {
        for (const effect of effectsIs('test').nok) {
          expect(effect()).toBe(false);
        }
      });
    });
  });

  describe('isNot() => Predicate', () => {
    describe('assert()', () => {
      it('should not throw a jest error', () => {
        for (const effect of effectsIs('assert', true).nok) {
          expect(effect).not.toThrow();
        }
      });

      it('should throw a jest error', () => {
        for (const effect of effectsIs('assert', true).ok) {
          expect(effect).toThrow('Expected value to not be:');
        }
      });

      it('should not throw a node error', () => {
        for (const effect of effectsIs('assert', true).nok) {
          expect(noJest(effect)).not.toThrow();
        }
      });

      it('should throw a node error', () => {
        for (const effect of effectsIs('assert', true).ok) {
          expect(noJest(effect)).toThrow(' !== ');
        }
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        for (const effect of effectsIs('test', true).nok) {
          expect(effect()).toBe(true);
        }
      });

      it('should return false', () => {
        for (const effect of effectsIs('test', true).ok) {
          expect(effect()).toBe(false);
        }
      });
    });
  });

  describe('isGreaterThan() => Predicate', () => {
    describe('assert()', () => {
      it('should not throw a jest error', () => {
        for (const effect of effectsIsGreaterThan('assert').ok) {
          expect(effect).not.toThrow();
        }
      });

      it('should throw a jest error', () => {
        for (const effect of effectsIsGreaterThan('assert').nok) {
          expect(effect).toThrow('Expected value to be greater than:');
        }
      });

      it('should not throw a node error', () => {
        for (const effect of effectsIsGreaterThan('assert').ok) {
          expect(noJest(effect)).not.toThrow();
        }
      });

      it('should throw a node error', () => {
        for (const effect of effectsIsGreaterThan('assert').nok) {
          expect(noJest(effect)).toThrow(/^-?[0-9] > 0$/);
        }
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        for (const effect of effectsIsGreaterThan('test').ok) {
          expect(effect()).toBe(true);
        }
      });

      it('should return false', () => {
        for (const effect of effectsIsGreaterThan('test').nok) {
          expect(effect()).toBe(false);
        }
      });
    });
  });

  describe('isGreaterThanOrEquals() => Predicate', () => {
    describe('assert()', () => {
      it('should not throw a jest error', () => {
        for (const effect of effectsIsGreaterThanOrEquals('assert').ok) {
          expect(effect).not.toThrow();
        }
      });

      it('should throw a jest error', () => {
        for (const effect of effectsIsGreaterThanOrEquals('assert').nok) {
          expect(effect).toThrow('Expected value to be greater than or equal:');
        }
      });

      it('should not throw a node error', () => {
        for (const effect of effectsIsGreaterThanOrEquals('assert').ok) {
          expect(noJest(effect)).not.toThrow();
        }
      });

      it('should throw a node error', () => {
        for (const effect of effectsIsGreaterThanOrEquals('assert').nok) {
          expect(noJest(effect)).toThrow(/^-?[0-9] >= 0$/);
        }
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        for (const effect of effectsIsGreaterThanOrEquals('test').ok) {
          expect(effect()).toBe(true);
        }
      });

      it('should return false', () => {
        for (const effect of effectsIsGreaterThanOrEquals('test').nok) {
          expect(effect()).toBe(false);
        }
      });
    });
  });

  describe('isLessThan() => Predicate', () => {
    describe('assert()', () => {
      it('should not throw a jest error', () => {
        for (const effect of effectsIsLessThan('assert').ok) {
          expect(effect).not.toThrow();
        }
      });

      it('should throw a jest error', () => {
        for (const effect of effectsIsLessThan('assert').nok) {
          expect(effect).toThrow('Expected value to be less than:');
        }
      });

      it('should not throw a node error', () => {
        for (const effect of effectsIsLessThan('assert').ok) {
          expect(noJest(effect)).not.toThrow();
        }
      });

      it('should throw a node error', () => {
        for (const effect of effectsIsLessThan('assert').nok) {
          expect(noJest(effect)).toThrow(/^-?[0-9] < 0$/);
        }
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        for (const effect of effectsIsLessThan('test').ok) {
          expect(effect()).toBe(true);
        }
      });

      it('should return false', () => {
        for (const effect of effectsIsLessThan('test').nok) {
          expect(effect()).toBe(false);
        }
      });
    });
  });

  describe('isLessThanOrEquals() => Predicate', () => {
    describe('assert()', () => {
      it('should not throw a jest error', () => {
        for (const effect of effectsIsLessThanOrEquals('assert').ok) {
          expect(effect).not.toThrow();
        }
      });

      it('should throw a jest error', () => {
        for (const effect of effectsIsLessThanOrEquals('assert').nok) {
          expect(effect).toThrow('Expected value to be less than or equal:');
        }
      });

      it('should not throw a node error', () => {
        for (const effect of effectsIsLessThanOrEquals('assert').ok) {
          expect(noJest(effect)).not.toThrow();
        }
      });

      it('should throw a node error', () => {
        for (const effect of effectsIsLessThanOrEquals('assert').nok) {
          expect(noJest(effect)).toThrow(/^-?[0-9] <= 0$/);
        }
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        for (const effect of effectsIsLessThanOrEquals('test').ok) {
          expect(effect()).toBe(true);
        }
      });

      it('should return false', () => {
        for (const effect of effectsIsLessThanOrEquals('test').nok) {
          expect(effect()).toBe(false);
        }
      });
    });
  });

  describe('matches() => Predicate', () => {
    describe('assert()', () => {
      it('should not throw a jest error', () => {
        for (const effect of effectsMatches('assert').ok) {
          expect(effect).not.toThrow();
        }
      });

      it('should throw a jest error', () => {
        for (const effect of effectsMatches('assert').nok) {
          expect(effect).toThrow('Expected value to match:');
        }
      });

      it('should not throw a node error', () => {
        for (const effect of effectsMatches('assert').ok) {
          expect(noJest(effect)).not.toThrow();
        }
      });

      it('should throw a node error', () => {
        for (const effect of effectsMatches('assert').nok) {
          expect(noJest(effect)).toThrow(/'[a-z]+' =~ \/foo\//);
        }
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        for (const effect of effectsMatches('test').ok) {
          expect(effect()).toBe(true);
        }
      });

      it('should return false', () => {
        for (const effect of effectsMatches('test').nok) {
          expect(effect()).toBe(false);
        }
      });
    });
  });

  describe('notMatches() => Predicate', () => {
    describe('assert()', () => {
      it('should not throw a jest error', () => {
        for (const effect of effectsMatches('assert', true).nok) {
          expect(effect).not.toThrow();
        }
      });

      it('should throw a jest error', () => {
        for (const effect of effectsMatches('assert', true).ok) {
          expect(effect).toThrow('Expected value not to match:');
        }
      });

      it('should not throw a node error', () => {
        for (const effect of effectsMatches('assert', true).nok) {
          expect(noJest(effect)).not.toThrow();
        }
      });

      it('should throw a node error', () => {
        for (const effect of effectsMatches('assert', true).ok) {
          expect(noJest(effect)).toThrow(/'[a-z]+' !~ \/foo\//);
        }
      });
    });

    describe('test()', () => {
      it('should return true', () => {
        for (const effect of effectsMatches('test', true).nok) {
          expect(effect()).toBe(true);
        }
      });

      it('should return false', () => {
        for (const effect of effectsMatches('test', true).ok) {
          expect(effect()).toBe(false);
        }
      });
    });
  });
});
