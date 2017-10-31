jest.mock('../findElement');

import {PageObject, PathSegment, Predicate} from '..';
import {findElement} from '../findElement';

const mockFindElement = findElement as jest.Mock;

class MockAdapter {
  public readonly findElements: jest.Mock<Promise<string[]>> = jest.fn();
  public readonly getCurrentUrl: jest.Mock<Promise<string>>;

  public constructor() {
    this.getCurrentUrl = jest
      .fn<Promise<string>>()
      .mockImplementation(async () => 'mockURL');
  }
}

const mockPath: PathSegment<string>[] = [
  {selector: 'mockSelector', unique: false}
];

const mockPredicate = async () => true;

class MockPageObject extends PageObject<string, MockAdapter> {
  public async callFindSelf(): Promise<string> {
    return this.findSelf();
  }

  public async callFindFirstDescendant(
    selector: string,
    predicate: Predicate<string>
  ): Promise<string> {
    return this.findFirstDescendant(selector, predicate);
  }

  public async callFindUniqueDescendant(
    selector: string,
    predicate: Predicate<string>
  ): Promise<string> {
    return this.findUniqueDescendant(selector, predicate);
  }
}

beforeEach(() => mockFindElement.mockClear());

describe('PageObject', () => {
  let mockAdapter: MockAdapter;
  let mockPageObject: MockPageObject;

  beforeEach(async () => {
    mockAdapter = new MockAdapter();
    mockPageObject = new MockPageObject(mockPath, mockAdapter);
  });

  describe('static goto(Page, adapter)', () => {
    it('should TODO', async () => {
      // TODO
    });
  });

  describe('findSelf()', () => {
    it('should call findElement() and return its result', async () => {
      mockFindElement.mockImplementation(async () => 'mockElement');

      const element = await mockPageObject.callFindSelf();

      expect(element).toBe('mockElement');

      expect(mockFindElement.mock.calls).toEqual([[mockPath, mockAdapter]]);
    });

    it('should call findElement() and rethrow its error', async () => {
      mockFindElement.mockImplementation(async () => {
        throw new Error('mockMessage');
      });

      await expect(mockPageObject.callFindSelf()).rejects.toEqual(
        new Error('mockMessage')
      );
    });
  });

  describe('findFirstDescendant(selector, predicate?)', () => {
    it('should call findElement() and return its result', async () => {
      mockFindElement.mockImplementation(async () => 'mockElement');

      const element = await mockPageObject.callFindFirstDescendant(
        'mockSelector',
        mockPredicate
      );

      expect(element).toBe('mockElement');

      expect(mockFindElement.mock.calls).toEqual([
        [
          [
            ...mockPath,
            {selector: 'mockSelector', unique: false, predicate: mockPredicate}
          ],
          mockAdapter
        ]
      ]);
    });

    it('should call findElement() and rethrow its error', async () => {
      mockFindElement.mockImplementation(async () => {
        throw new Error('mockMessage');
      });

      await expect(
        mockPageObject.callFindFirstDescendant('mockSelector', mockPredicate)
      ).rejects.toEqual(new Error('mockMessage'));
    });
  });

  describe('findUniqueDescendant(selector, predicate?)', () => {
    it('should call findElement() and return its result', async () => {
      mockFindElement.mockImplementation(async () => 'mockElement');

      const element = await mockPageObject.callFindUniqueDescendant(
        'mockSelector',
        mockPredicate
      );

      expect(element).toBe('mockElement');

      expect(mockFindElement.mock.calls).toEqual([
        [
          [
            ...mockPath,
            {selector: 'mockSelector', unique: true, predicate: mockPredicate}
          ],
          mockAdapter
        ]
      ]);
    });

    it('should call findElement() and rethrow its error', async () => {
      mockFindElement.mockImplementation(async () => {
        throw new Error('mockMessage');
      });

      await expect(
        mockPageObject.callFindUniqueDescendant('mockSelector', mockPredicate)
      ).rejects.toEqual(new Error('mockMessage'));
    });
  });

  describe('selectFirstDescendant(Component, predicate?)', () => {
    it('should TODO', async () => {
      // TODO
    });
  });

  describe('selectUniqueDescendant(Component, predicate?)', () => {
    it('should TODO', async () => {
      // TODO
    });
  });

  describe('goto(Page)', () => {
    it('should TODO', async () => {
      // TODO
    });
  });
});
