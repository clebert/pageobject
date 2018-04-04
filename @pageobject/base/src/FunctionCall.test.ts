import {FunctionCall} from '.';

describe('FunctionCall', () => {
  const context = {description: 'Object'};
  const effect = jest.fn();

  function fn(...args: string[]): FunctionCall<void> {
    return new FunctionCall(context, 'fn', arguments, effect);
  }

  it('should have the specified context', () => {
    expect(fn().context).toBe(context);
  });

  it('should have a description', () => {
    expect(fn().description).toBe('fn()');
    expect(fn('arg1').description).toBe("fn('arg1')");
    expect(fn('arg1', 'arg2').description).toBe("fn('arg1', 'arg2')");
  });

  it('should have the specified effect', () => {
    expect(fn().effect).toBe(effect);
  });
});
