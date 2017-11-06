/* tslint:disable no-any */

jest.mock('../findElement');

import {ComponentClass, PageClass, PageObject, PathSegment} from '..';
import {MockAdapter} from '../__mocks__/MockAdapter';
import {MockPageObject} from '../__mocks__/MockPageObject';
import {findElement} from '../findElement';

type MockComponentClassType = jest.Mock<MockPageObject> &
  ComponentClass<string, MockAdapter, MockPageObject>;

type MockPageClassType = jest.Mock<MockPageObject> &
  PageClass<string, MockAdapter, MockPageObject>;

const mockedFindElement = findElement as jest.Mock;

beforeEach(async () => {
  mockedFindElement.mockClear();
  mockedFindElement.mockReset();
});

const mockPath: PathSegment<string, MockAdapter>[] = [
  {selector: 'mockSelector', unique: false}
];

const mockPredicate = async () => true;

const rootPath = [{selector: 'html', unique: true}];

describe('PageObject', () => {
  let MockComponentClass: MockComponentClassType;
  let MockPageClass: MockPageClassType;
  let mockAdapter: MockAdapter;
  let mockPageObject: MockPageObject;

  beforeEach(async () => {
    MockComponentClass = jest.fn() as any;

    (MockComponentClass as any).selector = 'mockSelector';

    MockPageClass = jest.fn() as any;

    (MockPageClass as any).selectors = [];
    (MockPageClass as any).url = /mockUrl/;

    mockAdapter = new MockAdapter();
    mockPageObject = new MockPageObject(mockPath, mockAdapter);
  });

  describe('public PageObject.goto(Page, adapter)', () => {
    it('should return an instance of the specified page class', async () => {
      const page = await PageObject.goto(MockPageClass, mockAdapter);

      expect(MockPageClass.mock.instances.length).toBe(1);
      expect(MockPageClass.mock.instances[0]).toBe(page);

      expect(MockPageClass.mock.calls).toEqual([[rootPath, mockAdapter]]);
    });

    it('should call findElement(path, adapter) and rethrow its error', async () => {
      mockedFindElement.mockImplementation(async () => {
        throw new Error('mockMessage');
      });

      await expect(PageObject.goto(MockPageClass, mockAdapter)).rejects.toEqual(
        new Error('mockMessage')
      );
    });

    it('should call findElement(path, adapter) once', async () => {
      await PageObject.goto(MockPageClass, mockAdapter);

      expect(mockedFindElement.mock.calls).toEqual([[rootPath, mockAdapter]]);
    });

    it('should call findElement(path, adapter) multiple times', async () => {
      (MockPageClass as any).selectors = ['mockSelector1', 'mockSelector2'];

      await PageObject.goto(MockPageClass, mockAdapter);

      expect(mockedFindElement.mock.calls).toEqual([
        [rootPath, mockAdapter],
        [
          [...rootPath, {selector: 'mockSelector1', unique: false}],
          mockAdapter
        ],
        [[...rootPath, {selector: 'mockSelector2', unique: false}], mockAdapter]
      ]);
    });

    it('should throw a "No matching url found" error', async () => {
      (MockPageClass as any).url = /mockOtherUrl/;

      await expect(PageObject.goto(MockPageClass, mockAdapter)).rejects.toEqual(
        new Error(
          "No matching url found (actual='mockUrl', expected=/mockOtherUrl/)"
        )
      );
    });

    it('should call findElement(path, adapter) before matching the url', async () => {
      (MockPageClass as any).url = /mockOtherUrl/;

      try {
        await PageObject.goto(MockPageClass, mockAdapter);
      } catch {
        expect(mockedFindElement.mock.calls.length).toEqual(1);
      }
    });
  });

  describe('protected this.adapter', () => {
    it('should be the adapter associated with this page object', () => {
      expect(mockPageObject.getAdapter()).toBe(mockAdapter);
    });
  });

  describe('protected this.findSelf()', () => {
    it('should call findElement(path, adapter) and return its result', async () => {
      mockedFindElement.mockImplementation(async () => 'mockElement');

      const element = await mockPageObject.callFindSelf();

      expect(element).toBe('mockElement');

      expect(mockedFindElement.mock.calls).toEqual([[mockPath, mockAdapter]]);
    });

    it('should call findElement(path, adapter) and rethrow its error', async () => {
      mockedFindElement.mockImplementation(async () => {
        throw new Error('mockMessage');
      });

      await expect(mockPageObject.callFindSelf()).rejects.toEqual(
        new Error('mockMessage')
      );
    });
  });

  describe('protected this.findFirstDescendant(selector, predicate?)', () => {
    it('should call findElement(path, adapter) and return its result', async () => {
      mockedFindElement.mockImplementation(async () => 'mockElement');

      const element = await mockPageObject.callFindFirstDescendant(
        'mockSelector',
        mockPredicate
      );

      expect(element).toBe('mockElement');

      expect(mockedFindElement.mock.calls).toEqual([
        [
          [
            ...mockPath,
            {selector: 'mockSelector', unique: false, predicate: mockPredicate}
          ],
          mockAdapter
        ]
      ]);
    });

    it('should call findElement(path, adapter) and rethrow its error', async () => {
      mockedFindElement.mockImplementation(async () => {
        throw new Error('mockMessage');
      });

      await expect(
        mockPageObject.callFindFirstDescendant('mockSelector', mockPredicate)
      ).rejects.toEqual(new Error('mockMessage'));
    });
  });

  describe('protected this.findUniqueDescendant(selector, predicate?)', () => {
    it('should call findElement(path, adapter) and return its result', async () => {
      mockedFindElement.mockImplementation(async () => 'mockElement');

      const element = await mockPageObject.callFindUniqueDescendant(
        'mockSelector',
        mockPredicate
      );

      expect(element).toBe('mockElement');

      expect(mockedFindElement.mock.calls).toEqual([
        [
          [
            ...mockPath,
            {selector: 'mockSelector', unique: true, predicate: mockPredicate}
          ],
          mockAdapter
        ]
      ]);
    });

    it('should call findElement(path, adapter) and rethrow its error', async () => {
      mockedFindElement.mockImplementation(async () => {
        throw new Error('mockMessage');
      });

      await expect(
        mockPageObject.callFindUniqueDescendant('mockSelector', mockPredicate)
      ).rejects.toEqual(new Error('mockMessage'));
    });
  });

  describe('protected this.selectFirstDescendant(Component, predicate?)', () => {
    it('should return an instance of the specified component class', () => {
      const component = mockPageObject.callSelectFirstDescendant(
        MockComponentClass,
        mockPredicate
      );

      expect(MockComponentClass.mock.instances.length).toBe(1);
      expect(MockComponentClass.mock.instances[0]).toBe(component);

      expect(MockComponentClass.mock.calls).toEqual([
        [
          [
            ...mockPath,
            {selector: 'mockSelector', unique: false, predicate: mockPredicate}
          ],
          mockAdapter
        ]
      ]);
    });
  });

  describe('protected this.selectUniqueDescendant(Component, predicate?)', () => {
    it('should return an instance of the specified component class', () => {
      const component = mockPageObject.callSelectUniqueDescendant(
        MockComponentClass,
        mockPredicate
      );

      expect(MockComponentClass.mock.instances.length).toBe(1);
      expect(MockComponentClass.mock.instances[0]).toBe(component);

      expect(MockComponentClass.mock.calls).toEqual([
        [
          [
            ...mockPath,
            {selector: 'mockSelector', unique: true, predicate: mockPredicate}
          ],
          mockAdapter
        ]
      ]);
    });
  });

  describe('protected this.goto(Page)', () => {
    it('should call PageObject.goto(Page, adapter) and return its result', async () => {
      const mockedGoto = jest.spyOn(PageObject, 'goto');

      try {
        const page = await mockPageObject.callGoto(MockPageClass);

        expect(MockPageClass.mock.instances.length).toBe(1);
        expect(MockPageClass.mock.instances[0]).toBe(page);

        expect(MockPageClass.mock.calls).toEqual([[rootPath, mockAdapter]]);

        expect(mockedGoto.mock.calls).toEqual([[MockPageClass, mockAdapter]]);
      } finally {
        mockedGoto.mockRestore();
      }
    });

    it('should call PageObject.goto(Page, adapter) and rethrow its error', async () => {
      const mockedGoto = jest.spyOn(PageObject, 'goto');

      mockedGoto.mockImplementation(async () => {
        throw new Error('mockMessage');
      });

      try {
        await expect(mockPageObject.callGoto(MockPageClass)).rejects.toEqual(
          new Error('mockMessage')
        );

        expect(MockPageClass.mock.calls.length).toBe(0);
      } finally {
        mockedGoto.mockRestore();
      }
    });
  });
});
