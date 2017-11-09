/* tslint:disable no-any */

jest.mock('../_retryOnError');

import {inspect} from 'util';
import {AdapterMock} from '../AdapterMock';
import {findElement} from '../_findElement';
import {Action, retryOnError} from '../_retryOnError';

const retryOnErrorMock = retryOnError as jest.Mock;

let adapterMock: AdapterMock<string>;

beforeEach(async () => {
  retryOnErrorMock.mockClear();
  retryOnErrorMock.mockReset();

  retryOnErrorMock.mockImplementation(async (action: Action<any>) => action());

  adapterMock = new AdapterMock();

  adapterMock.findElements
    .mockImplementationOnce(async () => ['element1-1', 'element1-2'])
    .mockImplementationOnce(async () => ['element2-1', 'element2-2'])
    .mockImplementationOnce(async () => ['element3-1', 'element3-2']);
});

describe('findElement(path, adapter)', () => {
  it('should call retryOnError(action, retryDelay, timeout) and return its result', async () => {
    retryOnErrorMock.mockImplementation(async () => 'element');

    expect(await findElement([], adapterMock)).toBe('element');
  });

  it('should call retryOnError(action, retryDelay, timeout) and rethrow its error', async () => {
    retryOnErrorMock.mockImplementation(async () => {
      throw new Error('message');
    });

    await expect(findElement([], adapterMock)).rejects.toEqual(
      new Error('message')
    );
  });

  it('should call retryOnError(action, retryDelay, timeout) only once', async () => {
    await findElement(
      [
        {selector: 'selector1', unique: false},
        {selector: 'selector2', unique: false},
        {selector: 'selector3', unique: false}
      ],
      adapterMock
    );

    expect(retryOnErrorMock.mock.calls.length).toBe(1);
  });

  it('should call retryOnError(action, retryDelay, timeout) with the default timeout', async () => {
    process.env.ELEMENT_SEARCH_TIMEOUT = '';

    await findElement([{selector: 'selector', unique: false}], adapterMock);

    expect(retryOnErrorMock.mock.calls[0][1]).toBe(40);
    expect(retryOnErrorMock.mock.calls[0][2]).toBe(5000);
  });

  it('should call retryOnError(action, retryDelay, timeout) with an individual timeout', async () => {
    process.env.ELEMENT_SEARCH_TIMEOUT = '1000';

    await findElement([{selector: 'selector', unique: false}], adapterMock);

    expect(retryOnErrorMock.mock.calls[0][1]).toBe(40);
    expect(retryOnErrorMock.mock.calls[0][2]).toBe(1000);
  });

  it('should return a descendant element without mutating the path', async () => {
    const element = await findElement(
      Object.freeze([
        {selector: 'selector1', unique: false},
        {selector: 'selector2', unique: false},
        {selector: 'selector3', unique: false}
      ]) as any,
      adapterMock
    );

    expect(adapterMock.findElements.mock.calls).toEqual([
      ['selector1', undefined],
      ['selector2', 'element1-1'],
      ['selector3', 'element2-1']
    ]);

    expect(element).toBe('element3-1');
  });

  it('should return a descendant element using a predicate without mutating the path', async () => {
    const predicate = jest.fn(async (_, __, index) => index === 1);

    const element = await findElement(
      Object.freeze([
        {selector: 'selector1', unique: false, predicate},
        {selector: 'selector2', unique: false, predicate},
        {selector: 'selector3', unique: false, predicate}
      ]) as any,
      adapterMock
    );

    expect(predicate.mock.calls).toEqual([
      [adapterMock, 'element1-1', 0, ['element1-1', 'element1-2']],
      [adapterMock, 'element1-2', 1, ['element1-1', 'element1-2']],
      [adapterMock, 'element2-1', 0, ['element2-1', 'element2-2']],
      [adapterMock, 'element2-2', 1, ['element2-1', 'element2-2']],
      [adapterMock, 'element3-1', 0, ['element3-1', 'element3-2']],
      [adapterMock, 'element3-2', 1, ['element3-1', 'element3-2']]
    ]);

    expect(adapterMock.findElements.mock.calls).toEqual([
      ['selector1', undefined],
      ['selector2', 'element1-2'],
      ['selector3', 'element2-2']
    ]);

    expect(element).toBe('element3-2');
  });

  it('should call a predicate and rethrow its error', async () => {
    const predicate = jest.fn(async () => {
      throw new Error('message');
    });

    const path = [{selector: 'selector', unique: false, predicate}];

    await expect(findElement(path, adapterMock)).rejects.toEqual(
      new Error('message')
    );
  });

  it('should throw a "No path segments found" error', async () => {
    await expect(findElement([], adapterMock)).rejects.toEqual(
      new Error('No path segments found')
    );
  });

  it('should throw a "No elements found" error while searching the first path segment', async () => {
    const predicate = jest.fn(async () => false);

    const path = [
      {selector: 'selector1', unique: false, predicate},
      {selector: 'selector2', unique: false}
    ];

    await expect(findElement(path, adapterMock)).rejects.toEqual(
      new Error(`No elements found (path=${inspect([path[0]])})`)
    );
  });

  it('should throw a "No elements found" error while searching the second path segment', async () => {
    const predicate = jest.fn(async () => false);

    const path = [
      {selector: 'selector1', unique: false},
      {selector: 'selector2', unique: false, predicate}
    ];

    await expect(findElement(path, adapterMock)).rejects.toEqual(
      new Error(`No elements found (path=${inspect(path)})`)
    );
  });

  it('should throw a "No unique element found" error while searching the first path segment', async () => {
    const path = [
      {selector: 'selector1', unique: true},
      {selector: 'selector2', unique: false}
    ];

    await expect(findElement(path, adapterMock)).rejects.toEqual(
      new Error(`No unique element found (path=${inspect([path[0]])})`)
    );
  });

  it('should throw a "No unique element found" error while searching the second path segment', async () => {
    const path = [
      {selector: 'selector1', unique: false},
      {selector: 'selector2', unique: true}
    ];

    await expect(findElement(path, adapterMock)).rejects.toEqual(
      new Error(`No unique element found (path=${inspect(path)})`)
    );
  });

  it('should call adapter.findElements(selector, parent?) and rethrow its error', async () => {
    adapterMock.findElements.mockReset();

    adapterMock.findElements.mockImplementation(async () => {
      throw new Error('message');
    });

    const path = [{selector: 'selector', unique: false}];

    await expect(findElement(path, adapterMock)).rejects.toEqual(
      new Error('message')
    );
  });
});
