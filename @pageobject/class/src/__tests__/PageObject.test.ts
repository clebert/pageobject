/* tslint:disable no-any */

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
    return this.selectFirstDescendant(Component as any, predicate);
  }

  public async callSelectUniqueDescendant(
    Component: jest.Mock,
    predicate: Predicate<string>
  ): Promise<{}> {
    return this.selectUniqueDescendant(Component as any, predicate);
  }

  public async callGoto(Page: jest.Mock): Promise<{}> {
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
    mockedFindElement.mockReset();
  });

  describe('public PageObject.goto(Page, adapter)', () => {
    let MockPageClass: jest.Mock;

    beforeEach(() => {
      MockPageClass = jest.fn();
    });

    describe('called with a page class without declarations', () => {
      it('should return an instance of the specified page class', async () => {
        const page = await PageObject.goto(MockPageClass as any, mockAdapter);

        expect(mockedFindElement.mock.calls.length).toBe(0);

        expect(MockPageClass.mock.instances.length).toBe(1);
        expect(MockPageClass.mock.instances[0]).toBe(page);

        expect(MockPageClass.mock.calls).toEqual([
          [[{selector: 'html', unique: true}], mockAdapter]
        ]);
      });
    });

    describe('called with a page class with declared initial components', () => {
      let MockComponentClass1: jest.Mock;
      let MockComponentClass2: jest.Mock;

      beforeEach(() => {
        MockComponentClass1 = jest.fn();
        MockComponentClass2 = jest.fn();

        (MockComponentClass1 as any).selector = 'mockSelector1';
        (MockComponentClass2 as any).selector = 'mockSelector2';

        (MockPageClass as any).InitialComponents = [
          MockComponentClass1,
          MockComponentClass2
        ];
      });

      it('should return an instance of the specified page class', async () => {
        const page = await PageObject.goto(MockPageClass as any, mockAdapter);

        expect(mockedFindElement.mock.calls).toEqual([
          [
            [
              {selector: 'html', unique: true},
              {selector: 'mockSelector1', unique: false}
            ],
            mockAdapter
          ],
          [
            [
              {selector: 'html', unique: true},
              {selector: 'mockSelector2', unique: false}
            ],
            mockAdapter
          ]
        ]);

        expect(MockPageClass.mock.instances.length).toBe(1);
        expect(MockPageClass.mock.instances[0]).toBe(page);

        expect(MockPageClass.mock.calls).toEqual([
          [[{selector: 'html', unique: true}], mockAdapter]
        ]);
      });

      it('should call findElement(path, adapter) and rethrow its error', async () => {
        mockedFindElement.mockImplementation(async () => {
          throw new Error('mockMessage');
        });

        await expect(
          PageObject.goto(MockPageClass as any, mockAdapter)
        ).rejects.toEqual(new Error('mockMessage'));
      });
    });

    describe('called with a page class with declared initial elements', () => {
      beforeEach(() => {
        (MockPageClass as any).InitialElements = [
          'mockSelector1',
          'mockSelector2'
        ];
      });

      it('should return an instance of the specified page class', async () => {
        const page = await PageObject.goto(MockPageClass as any, mockAdapter);

        expect(mockedFindElement.mock.calls).toEqual([
          [
            [
              {selector: 'html', unique: true},
              {selector: 'mockSelector1', unique: false}
            ],
            mockAdapter
          ],
          [
            [
              {selector: 'html', unique: true},
              {selector: 'mockSelector2', unique: false}
            ],
            mockAdapter
          ]
        ]);

        expect(MockPageClass.mock.instances.length).toBe(1);
        expect(MockPageClass.mock.instances[0]).toBe(page);

        expect(MockPageClass.mock.calls).toEqual([
          [[{selector: 'html', unique: true}], mockAdapter]
        ]);
      });

      it('should call findElement(path, adapter) and rethrow its error', async () => {
        mockedFindElement.mockImplementation(async () => {
          throw new Error('mockMessage');
        });

        await expect(
          PageObject.goto(MockPageClass as any, mockAdapter)
        ).rejects.toEqual(new Error('mockMessage'));
      });
    });

    describe('called with a page class with declared regex url', () => {
      it('should return an instance of the specified page class', async () => {
        (MockPageClass as any).url = /mockURL/;

        const page = await PageObject.goto(MockPageClass as any, mockAdapter);

        expect(mockAdapter.getCurrentUrl.mock.calls).toEqual([[]]);
        expect(mockedFindElement.mock.calls.length).toEqual(0);

        expect(MockPageClass.mock.instances.length).toBe(1);
        expect(MockPageClass.mock.instances[0]).toBe(page);

        expect(MockPageClass.mock.calls).toEqual([
          [[{selector: 'html', unique: true}], mockAdapter]
        ]);
      });

      it('should throw a "No matching url found" error', async () => {
        (MockPageClass as any).url = /otherURL/;

        await expect(
          PageObject.goto(MockPageClass as any, mockAdapter)
        ).rejects.toEqual(
          new Error(
            "No matching url found (actual='mockURL', expected=/otherURL/)"
          )
        );
      });
    });

    describe('called with a page class with declared string url', () => {
      it('should return an instance of the specified page class', async () => {
        (MockPageClass as any).url = 'mockURL';

        const page = await PageObject.goto(MockPageClass as any, mockAdapter);

        expect(mockAdapter.getCurrentUrl.mock.calls).toEqual([[]]);
        expect(mockedFindElement.mock.calls.length).toEqual(0);

        expect(MockPageClass.mock.instances.length).toBe(1);
        expect(MockPageClass.mock.instances[0]).toBe(page);

        expect(MockPageClass.mock.calls).toEqual([
          [[{selector: 'html', unique: true}], mockAdapter]
        ]);
      });

      it('should throw a "No matching url found" error', async () => {
        (MockPageClass as any).url = 'otherURL';

        await expect(
          PageObject.goto(MockPageClass as any, mockAdapter)
        ).rejects.toEqual(
          new Error(
            "No matching url found (actual='mockURL', expected='otherURL')"
          )
        );
      });
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
