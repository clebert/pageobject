import {AbstractPageObject} from '@pageobject/core';
import {
  indexIsEqualTo,
  indexIsGreaterThan,
  indexIsGreaterThanOrEqualTo,
  indexIsLessThan,
  indexIsLessThanOrEqualTo
} from '.';

class TestPageObject extends AbstractPageObject<{}> {
  public readonly selector = 'test';
}

const pageObject = new TestPageObject(jest.fn());

describe('indexIsEqualTo()', () => {
  const predicate = indexIsEqualTo(1);

  it('should return true', async () => {
    await expect(predicate(pageObject, 1, [pageObject])).resolves.toBe(true);
  });

  it('should return false', async () => {
    await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);
    await expect(predicate(pageObject, 2, [pageObject])).resolves.toBe(false);
  });
});

describe('indexIsGreaterThan()', () => {
  const predicate = indexIsGreaterThan(1);

  it('should return true', async () => {
    await expect(predicate(pageObject, 2, [pageObject])).resolves.toBe(true);
  });

  it('should return false', async () => {
    await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);
    await expect(predicate(pageObject, 1, [pageObject])).resolves.toBe(false);
  });
});

describe('indexIsGreaterThanOrEqualTo()', () => {
  const predicate = indexIsGreaterThanOrEqualTo(1);

  it('should return true', async () => {
    await expect(predicate(pageObject, 1, [pageObject])).resolves.toBe(true);
    await expect(predicate(pageObject, 2, [pageObject])).resolves.toBe(true);
  });

  it('should return false', async () => {
    await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(false);
  });
});

describe('indexIsLessThan()', () => {
  const predicate = indexIsLessThan(1);

  it('should return true', async () => {
    await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(true);
  });

  it('should return false', async () => {
    await expect(predicate(pageObject, 1, [pageObject])).resolves.toBe(false);
    await expect(predicate(pageObject, 2, [pageObject])).resolves.toBe(false);
  });
});

describe('indexIsLessThanOrEqualTo()', () => {
  const predicate = indexIsLessThanOrEqualTo(1);

  it('should return true', async () => {
    await expect(predicate(pageObject, 0, [pageObject])).resolves.toBe(true);
    await expect(predicate(pageObject, 1, [pageObject])).resolves.toBe(true);
  });

  it('should return false', async () => {
    await expect(predicate(pageObject, 2, [pageObject])).resolves.toBe(false);
  });
});
