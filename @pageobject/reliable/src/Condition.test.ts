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

  let erroneousValueAccessor: jest.Mock;
  let erroneousCondition: Condition<any>;

  let neverEndingValueAccessor: jest.Mock;
  let neverEndingCondition: Condition<any>;

  beforeEach(() => {
    erroneousValueAccessor = jest.fn();

    erroneousValueAccessor
      .mockImplementationOnce(async () => {
        throw new Error('Accessor error');
      })
      .mockImplementationOnce(async () => 1);

    erroneousCondition = new Condition(
      truthy(),
      erroneousValueAccessor,
      'erroneous'
    );

    neverEndingValueAccessor = jest.fn();

    neverEndingValueAccessor.mockImplementation(
      async () => new Promise<void>(() => undefined)
    );

    neverEndingCondition = new Condition(
      truthy(),
      neverEndingValueAccessor,
      'neverEnding'
    );
  });

  describe('describe()', () => {
    it('should return a description', () => {
      expect(falsyCondition.describe()).toBe('(<falsy> IS TRUTHY)');
      expect(truthyCondition.describe()).toBe('(<truthy> IS TRUTHY)');
    });
  });

  describe('assert()', () => {
    it('should not throw an assertion error', async () => {
      await truthyCondition.assert();
    });

    it('should throw an assertion error', async () => {
      await expect(falsyCondition.assert()).rejects.toThrow(
        'Assertion failed: ((<falsy> = 0) IS TRUTHY)'
      );
    });

    it('should not throw an accessor error', async () => {
      await erroneousCondition.assert(100);

      expect(erroneousValueAccessor).toHaveBeenCalledTimes(2);
    });

    it('should throw an accessor error', async () => {
      await expect(erroneousCondition.assert()).rejects.toThrow(
        'Accessor error'
      );

      expect(erroneousValueAccessor).toHaveBeenCalledTimes(1);
    });

    it('should throw an accessor-timeout error', async () => {
      await expect(neverEndingCondition.assert(5)).rejects.toThrow(
        'Accessor timeout after 5 milliseconds'
      );

      expect(neverEndingValueAccessor).toHaveBeenCalledTimes(1);
    });
  });

  describe('evaluate()', async () => {
    it('should return an evaluation', async () => {
      await expect(falsyCondition.evaluate()).resolves.toEqual({
        description: '((<falsy> = 0) IS TRUTHY)',
        result: false
      });

      await expect(truthyCondition.evaluate()).resolves.toEqual({
        description: '((<truthy> = 1) IS TRUTHY)',
        result: true
      });
    });

    it('should not throw an accessor error', async () => {
      await expect(erroneousCondition.evaluate(100)).resolves.toEqual({
        description: '((<erroneous> = 1) IS TRUTHY)',
        result: true
      });

      expect(erroneousValueAccessor).toHaveBeenCalledTimes(2);
    });

    it('should throw an accessor error', async () => {
      await expect(erroneousCondition.evaluate()).rejects.toThrow(
        'Accessor error'
      );

      expect(erroneousValueAccessor).toHaveBeenCalledTimes(1);
    });

    it('should throw an accessor-timeout error', async () => {
      await expect(neverEndingCondition.evaluate(5)).rejects.toThrow(
        'Accessor timeout after 5 milliseconds'
      );

      expect(neverEndingValueAccessor).toHaveBeenCalledTimes(1);
    });
  });

  describe('test()', () => {
    it('should return true', async () => {
      await expect(truthyCondition.test()).resolves.toBe(true);
    });

    it('should return false', async () => {
      await expect(falsyCondition.test()).resolves.toBe(false);
    });

    it('should not throw an accessor error', async () => {
      await expect(erroneousCondition.test(100)).resolves.toBe(true);

      expect(erroneousValueAccessor).toHaveBeenCalledTimes(2);
    });

    it('should throw an accessor error', async () => {
      await expect(erroneousCondition.test()).rejects.toThrow('Accessor error');

      expect(erroneousValueAccessor).toHaveBeenCalledTimes(1);
    });

    it('should throw an accessor-timeout error', async () => {
      await expect(neverEndingCondition.test(5)).rejects.toThrow(
        'Accessor timeout after 5 milliseconds'
      );

      expect(neverEndingValueAccessor).toHaveBeenCalledTimes(1);
    });
  });
});
