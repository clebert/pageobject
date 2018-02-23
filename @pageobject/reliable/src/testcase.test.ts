/* tslint:disable no-any */

import {TestCase} from '.';

class ConditionMock {
  public readonly assert = jest.fn();
  public readonly test = jest.fn();
}

describe('TestCase', () => {
  let testCase: TestCase;

  beforeEach(() => {
    testCase = new TestCase(10000);
  });

  describe('assert()', () => {
    it('should assert the specified condition', async () => {
      const condition = new ConditionMock();

      await testCase.assert(condition as any).run();

      expect(condition.assert).toHaveBeenCalledTimes(1);
      expect(condition.assert).toHaveBeenCalledWith(10000);
    });
  });

  describe('perform()', () => {
    it('should perform the specified action', async () => {
      const action = jest.fn();

      await testCase.perform(action).run();

      expect(action).toHaveBeenCalledTimes(1);
      expect(action).toHaveBeenCalledWith();
    });
  });

  describe('when()', () => {
    describe('if the specified condition evaluates to true', () => {
      it('should run the primary specified test steps', async () => {
        const truthy = new ConditionMock();

        truthy.test.mockImplementation(async () => true);

        const conditionalCondition1 = new ConditionMock();
        const conditionalCondition2 = new ConditionMock();

        await testCase
          .when(
            truthy as any,
            then => then.assert(conditionalCondition1 as any),
            otherwise => otherwise.assert(conditionalCondition2 as any)
          )
          .run();

        expect(truthy.test).toHaveBeenCalledTimes(1);
        expect(truthy.test).toHaveBeenCalledWith(10000);

        expect(conditionalCondition1.assert).toHaveBeenCalledTimes(1);
        expect(conditionalCondition1.assert).toHaveBeenCalledWith(10000);

        expect(conditionalCondition2.assert).toHaveBeenCalledTimes(0);
      });
    });

    describe('if the specified condition evaluates to false', () => {
      it('should run the secondary specified test steps', async () => {
        const falsy = new ConditionMock();

        falsy.test.mockImplementation(async () => false);

        const conditionalCondition1 = new ConditionMock();
        const conditionalCondition2 = new ConditionMock();

        await testCase
          .when(
            falsy as any,
            then => then.assert(conditionalCondition1 as any),
            otherwise => otherwise.assert(conditionalCondition2 as any)
          )
          .run();

        expect(falsy.test).toHaveBeenCalledTimes(1);
        expect(falsy.test).toHaveBeenCalledWith(10000);

        expect(conditionalCondition1.assert).toHaveBeenCalledTimes(0);

        expect(conditionalCondition2.assert).toHaveBeenCalledTimes(1);
        expect(conditionalCondition2.assert).toHaveBeenCalledWith(10000);
      });

      it('should run no test steps', async () => {
        const falsy = new ConditionMock();

        falsy.test.mockImplementation(async () => false);

        const conditionalCondition = new ConditionMock();

        await testCase
          .when(falsy as any, then => then.assert(conditionalCondition as any))
          .run();

        expect(falsy.test).toHaveBeenCalledTimes(1);
        expect(falsy.test).toHaveBeenCalledWith(10000);

        expect(conditionalCondition.assert).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('run()', async () => {
    it('should run the test steps sequentially', async () => {
      const calls: string[] = [];

      const condition = new ConditionMock();

      condition.assert.mockImplementation(async () => {
        calls.push('assert()');
      });

      const truthy = new ConditionMock();

      truthy.test.mockImplementation(async () => true);

      const conditionalAction = jest.fn();

      conditionalAction.mockImplementation(async () => {
        calls.push('when()');
      });

      const action = jest.fn();

      action.mockImplementation(async () => {
        calls.push('perform()');
      });

      await testCase
        .assert(condition as any)
        .when(truthy as any, then => then.perform(conditionalAction))
        .perform(action)
        .run();

      expect(calls).toEqual(['assert()', 'when()', 'perform()']);
    });
  });

  it('should throw an assertion error', async () => {
    const condition = new ConditionMock();

    condition.assert.mockImplementation(async () => {
      throw new Error('Assertion error');
    });

    await expect(testCase.assert(condition as any).run()).rejects.toThrow(
      'Assertion error'
    );
  });

  it('should throw an action error', async () => {
    const action = jest.fn();

    action.mockImplementation(async () => {
      throw new Error('Action error');
    });

    await expect(testCase.perform(action).run()).rejects.toThrow(
      'Action error'
    );
  });

  it('should throw a conditional error', async () => {
    const truthy = new ConditionMock();

    truthy.test.mockImplementation(async () => true);

    const conditionalAction = jest.fn();

    conditionalAction.mockImplementation(async () => {
      throw new Error('Action error');
    });

    await expect(
      testCase
        .when(truthy as any, then => then.perform(conditionalAction))
        .run()
    ).rejects.toThrow('Action error');
  });
});
