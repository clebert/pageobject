import {AbstractPageObject} from '@pageobject/core';
import * as predicates from '.';

class TestPageObject extends AbstractPageObject<object> {
  public readonly selector = 'test';
}

describe('predicates', () => {
  const pageObject = new TestPageObject({findElements: async () => []});

  const actual = jest.fn();
  const falsy = () => jest.fn().mockImplementation(async () => false);
  const truthy = () => jest.fn().mockImplementation(async () => true);

  beforeEach(() => {
    actual.mockReset();
  });

  describe('and()', () => {
    it('should return true', async () => {
      const predicateA = truthy();
      const predicateB = truthy();

      await expect(
        predicates.and(predicateA, predicateB)(pageObject, 123, [pageObject])
      ).resolves.toBe(true);

      expect(predicateA).toHaveBeenCalledTimes(1);
      expect(predicateA).toHaveBeenCalledWith(pageObject, 123, [pageObject]);

      expect(predicateB).toHaveBeenCalledTimes(1);
      expect(predicateB).toHaveBeenCalledWith(pageObject, 123, [pageObject]);
    });

    it('should return false', async () => {
      await expect(
        predicates.and(falsy(), falsy())(pageObject, 123, [pageObject])
      ).resolves.toBe(false);

      await expect(
        predicates.and(falsy(), truthy())(pageObject, 123, [pageObject])
      ).resolves.toBe(false);

      await expect(
        predicates.and(truthy(), falsy())(pageObject, 123, [pageObject])
      ).resolves.toBe(false);
    });
  });

  describe('or()', () => {
    it('should return true', async () => {
      const predicateA = falsy();
      const predicateB = truthy();

      await expect(
        predicates.or(predicateA, predicateB)(pageObject, 123, [pageObject])
      ).resolves.toBe(true);

      expect(predicateA).toHaveBeenCalledTimes(1);
      expect(predicateA).toHaveBeenCalledWith(pageObject, 123, [pageObject]);

      expect(predicateB).toHaveBeenCalledTimes(1);
      expect(predicateB).toHaveBeenCalledWith(pageObject, 123, [pageObject]);

      await expect(
        predicates.or(truthy(), falsy())(pageObject, 123, [pageObject])
      ).resolves.toBe(true);

      await expect(
        predicates.or(truthy(), truthy())(pageObject, 123, [pageObject])
      ).resolves.toBe(true);
    });

    it('should return false', async () => {
      await expect(
        predicates.or(falsy(), falsy())(pageObject, 123, [pageObject])
      ).resolves.toBe(false);
    });
  });

  describe('not()', () => {
    it('should return true', async () => {
      const predicate = falsy();

      await expect(
        predicates.not(predicate)(pageObject, 123, [pageObject])
      ).resolves.toBe(true);

      expect(predicate).toHaveBeenCalledTimes(1);
      expect(predicate).toHaveBeenCalledWith(pageObject, 123, [pageObject]);
    });

    it('should return false', async () => {
      await expect(
        predicates.not(truthy())(pageObject, 123, [pageObject])
      ).resolves.toBe(false);
    });
  });

  describe('indexEquals()', () => {
    const predicate = predicates.indexEquals<object, TestPageObject>(1);

    it('should return true', async () => {
      await expect(predicate(pageObject, 1, [pageObject])).resolves.toBe(true);
    });

    it('should return false', async () => {
      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);
      await expect(predicate(pageObject, 2, [pageObject])).resolves.toBe(false);
    });
  });

  describe('indexIsGreaterThan()', () => {
    const predicate = predicates.indexIsGreaterThan<object, TestPageObject>(1);

    it('should return true', async () => {
      await expect(predicate(pageObject, 2, [pageObject])).resolves.toBe(true);
    });

    it('should return false', async () => {
      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);
      await expect(predicate(pageObject, 1, [pageObject])).resolves.toBe(false);
    });
  });

  describe('indexIsGreaterThanOrEquals()', () => {
    const predicate = predicates.indexIsGreaterThanOrEquals<
      object,
      TestPageObject
    >(1);

    it('should return true', async () => {
      await expect(predicate(pageObject, 1, [pageObject])).resolves.toBe(true);
      await expect(predicate(pageObject, 2, [pageObject])).resolves.toBe(true);
    });

    it('should return false', async () => {
      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);
    });
  });

  describe('indexIsLessThan()', () => {
    const predicate = predicates.indexIsLessThan<object, TestPageObject>(1);

    it('should return true', async () => {
      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(true);
    });

    it('should return false', async () => {
      await expect(predicate(pageObject, 1, [pageObject])).resolves.toBe(false);
      await expect(predicate(pageObject, 2, [pageObject])).resolves.toBe(false);
    });
  });

  describe('indexIsLessThanOrEquals()', () => {
    const predicate = predicates.indexIsLessThanOrEquals<
      object,
      TestPageObject
    >(1);

    it('should return true', async () => {
      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(true);
      await expect(predicate(pageObject, 1, [pageObject])).resolves.toBe(true);
    });

    it('should return false', async () => {
      await expect(predicate(pageObject, 2, [pageObject])).resolves.toBe(false);
    });
  });

  describe('equals()', () => {
    const predicate = predicates.equals(actual, 'foo');

    it('should return true', async () => {
      actual.mockImplementation(async () => 'foo');

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(true);

      expect(actual).toHaveBeenCalledTimes(1);
      expect(actual).toHaveBeenLastCalledWith(pageObject);
    });

    it('should return false', async () => {
      actual.mockImplementation(async () => 'foobar');

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);
    });
  });

  describe('matches()', () => {
    const predicate = predicates.matches(actual, /foo/);

    it('should return true', async () => {
      actual.mockImplementation(async () => 'foobar');

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(true);

      expect(actual).toHaveBeenCalledTimes(1);
      expect(actual).toHaveBeenLastCalledWith(pageObject);
    });

    it('should return false', async () => {
      actual.mockImplementation(async () => 'bar');

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);
    });
  });

  describe('isGreaterThan()', () => {
    const predicate = predicates.isGreaterThan(actual, 1);

    it('should return true', async () => {
      actual.mockImplementation(async () => 2);

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(true);

      expect(actual).toHaveBeenCalledTimes(1);
      expect(actual).toHaveBeenLastCalledWith(pageObject);
    });

    it('should return false', async () => {
      actual.mockImplementation(async () => 0);

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);

      actual.mockImplementation(async () => 1);

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);
    });
  });

  describe('isGreaterThanOrEquals()', () => {
    const predicate = predicates.isGreaterThanOrEquals(actual, 1);

    it('should return true', async () => {
      actual.mockImplementation(async () => 1);

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(true);

      expect(actual).toHaveBeenCalledTimes(1);
      expect(actual).toHaveBeenLastCalledWith(pageObject);

      actual.mockImplementation(async () => 2);

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(true);
    });

    it('should return false', async () => {
      actual.mockImplementation(async () => 0);

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);
    });
  });

  describe('isLessThan()', () => {
    const predicate = predicates.isLessThan(actual, 1);

    it('should return true', async () => {
      actual.mockImplementation(async () => 0);

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(true);

      expect(actual).toHaveBeenCalledTimes(1);
      expect(actual).toHaveBeenLastCalledWith(pageObject);
    });

    it('should return false', async () => {
      actual.mockImplementation(async () => 1);

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);

      actual.mockImplementation(async () => 2);

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);
    });
  });

  describe('isLessThanOrEquals()', () => {
    const predicate = predicates.isLessThanOrEquals(actual, 1);

    it('should return true', async () => {
      actual.mockImplementation(async () => 0);

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(true);

      expect(actual).toHaveBeenCalledTimes(1);
      expect(actual).toHaveBeenLastCalledWith(pageObject);

      actual.mockImplementation(async () => 1);

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(true);
    });

    it('should return false', async () => {
      actual.mockImplementation(async () => 2);

      await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);
    });
  });
});
