/* tslint:disable no-any */

import {Condition, Operator} from '.';

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

describe('Condition', () => {
  const falsyCondition = new Condition(truthy(), async () => 0, 'falsy');
  const truthyCondition = new Condition(truthy(), async () => 1, 'truthy');

  const erroneousCondition = new Condition(
    truthy(),
    () => {
      throw new Error('Accessor error');
    },
    'erroneous'
  );

  describe('describe()', () => {
    it('should return a description', () => {
      expect(falsyCondition.describe()).toBe('(falsy IS TRUTHY)');
      expect(truthyCondition.describe()).toBe('(truthy IS TRUTHY)');
    });
  });

  describe('assert()', () => {
    it('should not throw an assertion error', async () => {
      await truthyCondition.assert();
    });

    it('should throw an assertion error', async () => {
      await expect(falsyCondition.assert()).rejects.toEqual(
        new Error('Assertion failed: ((falsy = 0) IS TRUTHY)')
      );
    });

    it('should throw an accessor error', async () => {
      await expect(erroneousCondition.assert()).rejects.toEqual(
        new Error('Accessor error')
      );
    });
  });

  describe('evaluate()', async () => {
    it('should return an evaluation', async () => {
      await expect(falsyCondition.evaluate()).resolves.toEqual({
        description: '((falsy = 0) IS TRUTHY)',
        result: false
      });

      await expect(truthyCondition.evaluate()).resolves.toEqual({
        description: '((truthy = 1) IS TRUTHY)',
        result: true
      });
    });

    it('should throw an accessor error', async () => {
      await expect(erroneousCondition.evaluate()).rejects.toEqual(
        new Error('Accessor error')
      );
    });
  });

  describe('test()', () => {
    it('should return true', async () => {
      await expect(truthyCondition.test()).resolves.toBe(true);
    });

    it('should return false', async () => {
      await expect(falsyCondition.test()).resolves.toBe(false);
    });

    it('should throw an accessor error', async () => {
      await expect(erroneousCondition.test()).rejects.toEqual(
        new Error('Accessor error')
      );
    });
  });
});
