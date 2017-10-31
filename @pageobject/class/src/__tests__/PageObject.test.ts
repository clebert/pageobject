jest.mock('../findElement');

import {PageObject, PathSegment, Predicate} from '..';
import {findElement} from '../findElement';

const mockedFindElement = findElement as jest.Mock;

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
  public getAdapter(): MockAdapter {
    return this.adapter;
  }

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

  public async callSelectFirstDescendant(
    Component: jest.Mock,
    predicate: Predicate<string>
  ): Promise<{}> {
    /* tslint:disable-next-line no-any */
    return this.selectFirstDescendant(Component as any, predicate);
  }

  public async callSelectUniqueDescendant(
    Component: jest.Mock,
    predicate: Predicate<string>
  ): Promise<{}> {
    /* tslint:disable-next-line no-any */
    return this.selectUniqueDescendant(Component as any, predicate);
  }

  public async callGoto(Page: jest.Mock): Promise<{}> {
    /* tslint:disable-next-line no-any */
    return this.goto(Page as any);
  }
}

describe('PageObject', () => {
  let mockAdapter: MockAdapter;
  let mockPageObject: MockPageObject;

  beforeEach(async () => {
    mockAdapter = new MockAdapter();
    mockPageObject = new MockPageObject(mockPath, mockAdapter);

    mockedFindElement.mockClear();
  });

  describe('public PageObject.goto(Page, adapter)', () => {
    it('should TODO', async () => {
      // TODO
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
    it('should return an instance of the specified component class', async () => {
      const MockComponentClass = jest.fn();

      /* tslint:disable-next-line no-any */
      (MockComponentClass as any).selector = 'mockSelector';

      const component = await mockPageObject.callSelectFirstDescendant(
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
    it('should return an instance of the specified component class', async () => {
      const MockComponentClass = jest.fn();

      /* tslint:disable-next-line no-any */
      (MockComponentClass as any).selector = 'mockSelector';

      const component = await mockPageObject.callSelectUniqueDescendant(
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
        const MockPageClass = jest.fn();
        const page = await mockPageObject.callGoto(MockPageClass);

        expect(MockPageClass.mock.instances.length).toBe(1);
        expect(MockPageClass.mock.instances[0]).toBe(page);

        expect(MockPageClass.mock.calls).toEqual([
          [[{selector: 'html', unique: true}], mockAdapter]
        ]);

        expect(mockedGoto.mock.calls).toEqual([[MockPageClass, mockAdapter]]);
      } finally {
        mockedGoto.mockRestore();
      }
    });
  });
});
