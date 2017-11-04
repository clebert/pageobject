import {inspect} from 'util';
import {MockAdapter} from '../__mocks__/MockAdapter';
import {findElement} from '../findElement';

describe('findElement(path, adapter)', () => {
  let mockAdapter: MockAdapter;

  beforeEach(async () => {
    mockAdapter = new MockAdapter();

    mockAdapter.findElements
      .mockImplementationOnce(async () => ['mockElement1-1', 'mockElement1-2'])
      .mockImplementationOnce(async () => ['mockElement2-1', 'mockElement2-2'])
      .mockImplementationOnce(async () => ['mockElement3-1', 'mockElement3-2']);
  });

  it('should return a descendant element', async () => {
    const element = await findElement(
      [
        {selector: 'mockSelector1', unique: false},
        {selector: 'mockSelector2', unique: false},
        {selector: 'mockSelector3', unique: false}
      ],
      mockAdapter
    );

    expect(mockAdapter.findElements.mock.calls).toEqual([
      ['mockSelector1'],
      ['mockSelector2', 'mockElement1-1'],
      ['mockSelector3', 'mockElement2-1']
    ]);

    expect(element).toBe('mockElement3-1');
  });

  it('should return a descendant element using a predicate', async () => {
    const predicate = jest.fn(async (_, index) => index === 1);

    const element = await findElement(
      [
        {selector: 'mockSelector1', unique: false, predicate},
        {selector: 'mockSelector2', unique: false, predicate},
        {selector: 'mockSelector3', unique: false, predicate}
      ],
      mockAdapter
    );

    expect(predicate.mock.calls).toEqual([
      ['mockElement1-1', 0, ['mockElement1-1', 'mockElement1-2']],
      ['mockElement1-2', 1, ['mockElement1-1', 'mockElement1-2']],
      ['mockElement2-1', 0, ['mockElement2-1', 'mockElement2-2']],
      ['mockElement2-2', 1, ['mockElement2-1', 'mockElement2-2']],
      ['mockElement3-1', 0, ['mockElement3-1', 'mockElement3-2']],
      ['mockElement3-2', 1, ['mockElement3-1', 'mockElement3-2']]
    ]);

    expect(mockAdapter.findElements.mock.calls).toEqual([
      ['mockSelector1'],
      ['mockSelector2', 'mockElement1-2'],
      ['mockSelector3', 'mockElement2-2']
    ]);

    expect(element).toBe('mockElement3-2');
  });

  it('should call a predicate and rethrow its error', async () => {
    const predicate = jest.fn(async () => {
      throw new Error('mockMessage');
    });

    const mockPath = [{selector: 'mockSelector', unique: false, predicate}];

    await expect(findElement(mockPath, mockAdapter)).rejects.toEqual(
      new Error('mockMessage')
    );
  });

  it('should throw a "No path segments found" error', async () => {
    await expect(findElement([], mockAdapter)).rejects.toEqual(
      new Error('No path segments found')
    );
  });

  it('should throw a "No elements found" error while searching the first path segment', async () => {
    const predicate = jest.fn(async () => false);

    const mockPath = [
      {selector: 'mockSelector1', unique: false, predicate},
      {selector: 'mockSelector2', unique: false}
    ];

    await expect(findElement(mockPath, mockAdapter)).rejects.toEqual(
      new Error(`No elements found (path=${inspect([mockPath[0]])})`)
    );
  });

  it('should throw a "No elements found" error while searching the second path segment', async () => {
    const predicate = jest.fn(async () => false);

    const mockPath = [
      {selector: 'mockSelector1', unique: false},
      {selector: 'mockSelector2', unique: false, predicate}
    ];

    await expect(findElement(mockPath, mockAdapter)).rejects.toEqual(
      new Error(`No elements found (path=${inspect(mockPath)})`)
    );
  });

  it('should throw a "No unique element found" error while searching the first path segment', async () => {
    const mockPath = [
      {selector: 'mockSelector1', unique: true},
      {selector: 'mockSelector2', unique: false}
    ];

    await expect(findElement(mockPath, mockAdapter)).rejects.toEqual(
      new Error(`No unique element found (path=${inspect([mockPath[0]])})`)
    );
  });

  it('should throw a "No unique element found" error while searching the second path segment', async () => {
    const mockPath = [
      {selector: 'mockSelector1', unique: false},
      {selector: 'mockSelector2', unique: true}
    ];

    await expect(findElement(mockPath, mockAdapter)).rejects.toEqual(
      new Error(`No unique element found (path=${inspect(mockPath)})`)
    );
  });

  it('should call adapter.findElements(selector, parent?) and rethrow its error', async () => {
    mockAdapter.findElements.mockReset();

    mockAdapter.findElements.mockImplementation(async () => {
      throw new Error('mockMessage');
    });

    const mockPath = [{selector: 'mockSelector', unique: false}];

    await expect(findElement(mockPath, mockAdapter)).rejects.toEqual(
      new Error('mockMessage')
    );
  });
});
