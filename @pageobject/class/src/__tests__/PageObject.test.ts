/* tslint:disable no-any */

jest.mock('../_findElement');

import {ComponentClass, PageClass, PageObject, Predicate} from '..';
import {AdapterMock} from '../AdapterMock';
import {findElement} from '../_findElement';

class AccessiblePageObject extends PageObject<string, AdapterMock<string>> {
  public getAdapter(): AdapterMock<string> {
    return this.adapter;
  }

  public async callFindSelf(): Promise<string> {
    return this.findSelf();
  }

  public async callFindFirstDescendant(
    selector: string,
    predicate: Predicate<string, AdapterMock<string>>
  ): Promise<string> {
    return this.findFirstDescendant(selector, predicate);
  }

  public async callFindUniqueDescendant(
    selector: string,
    predicate: Predicate<string, AdapterMock<string>>
  ): Promise<string> {
    return this.findUniqueDescendant(selector, predicate);
  }

  public callSelectFirstDescendant(
    Component: jest.Mock<PageObject<string, AdapterMock<string>>>,
    predicate: Predicate<string, AdapterMock<string>>
  ): PageObject<string, AdapterMock<string>> {
    return this.selectFirstDescendant(Component as any, predicate);
  }

  public callSelectUniqueDescendant(
    Component: jest.Mock<PageObject<string, AdapterMock<string>>>,
    predicate: Predicate<string, AdapterMock<string>>
  ): PageObject<string, AdapterMock<string>> {
    return this.selectUniqueDescendant(Component as any, predicate);
  }

  public async callGoto(
    Page: jest.Mock<PageObject<string, AdapterMock<string>>>
  ): Promise<PageObject<string, AdapterMock<string>>> {
    return this.goto(Page as any);
  }
}

type ComponentClassMockType = jest.Mock<AccessiblePageObject> &
  ComponentClass<string, AdapterMock<string>, AccessiblePageObject>;

type PageClassMockType = jest.Mock<AccessiblePageObject> &
  PageClass<string, AdapterMock<string>, AccessiblePageObject>;

const path = [{selector: 'selector', unique: false}];
const rootPath = [{selector: ':root', unique: true}];

const truthyPredicate = async () => true;

const findElementMock = findElement as jest.Mock;

let ComponentClassMock: ComponentClassMockType;
let PageClassMock: PageClassMockType;
let adapterMock: AdapterMock<string>;
let pageObject: AccessiblePageObject;

beforeEach(async () => {
  Object.defineProperty(window.location, 'href', {
    writable: true,
    value: 'url'
  });

  findElementMock.mockClear();
  findElementMock.mockReset();

  ComponentClassMock = jest.fn() as any;

  (ComponentClassMock as any).selector = 'selector';

  PageClassMock = jest.fn() as any;

  (PageClassMock as any).selectors = [];
  (PageClassMock as any).url = /url/;

  adapterMock = new AdapterMock();

  adapterMock.evaluate.mockImplementation(async script => script());

  pageObject = new AccessiblePageObject(path, adapterMock);
});

afterEach(() => {
  window.location.href = 'about:blank';
});

describe('PageObject', () => {
  describe('public PageObject.goto(Page, adapter)', () => {
    it('should return an instance of the specified page class', async () => {
      const page = await PageObject.goto(PageClassMock, adapterMock);

      expect(PageClassMock.mock.instances.length).toBe(1);
      expect(PageClassMock.mock.instances[0]).toBe(page);

      expect(PageClassMock.mock.calls).toEqual([[rootPath, adapterMock]]);
    });

    it('should call findElement(path, adapter) and rethrow its error', async () => {
      findElementMock.mockImplementation(async () => {
        throw new Error('message');
      });

      await expect(PageObject.goto(PageClassMock, adapterMock)).rejects.toEqual(
        new Error('message')
      );
    });

    it('should call findElement(path, adapter) once', async () => {
      await PageObject.goto(PageClassMock, adapterMock);

      expect(findElementMock.mock.calls).toEqual([[rootPath, adapterMock]]);
    });

    it('should call findElement(path, adapter) multiple times', async () => {
      (PageClassMock as any).selectors = ['selector1', 'selector2'];

      await PageObject.goto(PageClassMock, adapterMock);

      expect(findElementMock.mock.calls).toEqual([
        [rootPath, adapterMock],
        [[...rootPath, {selector: 'selector1', unique: false}], adapterMock],
        [[...rootPath, {selector: 'selector2', unique: false}], adapterMock]
      ]);
    });

    it('should call adapter.evaluate(script, ...args) and rethrow its error ', async () => {
      adapterMock.evaluate.mockImplementation(async () => {
        throw new Error('message');
      });

      await expect(PageObject.goto(PageClassMock, adapterMock)).rejects.toEqual(
        new Error('message')
      );
    });

    it('should throw a "No matching url found" error', async () => {
      (PageClassMock as any).url = /otherUrl/;

      await expect(PageObject.goto(PageClassMock, adapterMock)).rejects.toEqual(
        new Error("No matching url found (actual='url', expected=/otherUrl/)")
      );
    });

    it('should call findElement(path, adapter) before matching the url', async () => {
      (PageClassMock as any).url = /otherUrl/;

      try {
        await PageObject.goto(PageClassMock, adapterMock);
      } catch {
        expect(findElementMock.mock.calls.length).toEqual(1);
      }
    });
  });

  describe('protected this.adapter', () => {
    it('should be the adapter associated with this page object', () => {
      expect(pageObject.getAdapter()).toBe(adapterMock);
    });
  });

  describe('protected this.findSelf()', () => {
    it('should call findElement(path, adapter) and return its result', async () => {
      findElementMock.mockImplementation(async () => 'element');

      const element = await pageObject.callFindSelf();

      expect(element).toBe('element');

      expect(findElementMock.mock.calls).toEqual([[path, adapterMock]]);
    });

    it('should call findElement(path, adapter) and rethrow its error', async () => {
      findElementMock.mockImplementation(async () => {
        throw new Error('message');
      });

      await expect(pageObject.callFindSelf()).rejects.toEqual(
        new Error('message')
      );
    });
  });

  describe('protected this.findFirstDescendant(selector, predicate?)', () => {
    it('should call findElement(path, adapter) and return its result', async () => {
      findElementMock.mockImplementation(async () => 'element');

      const element = await pageObject.callFindFirstDescendant(
        'selector',
        truthyPredicate
      );

      expect(element).toBe('element');

      expect(findElementMock.mock.calls).toEqual([
        [
          [
            ...path,
            {selector: 'selector', unique: false, predicate: truthyPredicate}
          ],
          adapterMock
        ]
      ]);
    });

    it('should call findElement(path, adapter) and rethrow its error', async () => {
      findElementMock.mockImplementation(async () => {
        throw new Error('message');
      });

      await expect(
        pageObject.callFindFirstDescendant('selector', truthyPredicate)
      ).rejects.toEqual(new Error('message'));
    });
  });

  describe('protected this.findUniqueDescendant(selector, predicate?)', () => {
    it('should call findElement(path, adapter) and return its result', async () => {
      findElementMock.mockImplementation(async () => 'element');

      const element = await pageObject.callFindUniqueDescendant(
        'selector',
        truthyPredicate
      );

      expect(element).toBe('element');

      expect(findElementMock.mock.calls).toEqual([
        [
          [
            ...path,
            {selector: 'selector', unique: true, predicate: truthyPredicate}
          ],
          adapterMock
        ]
      ]);
    });

    it('should call findElement(path, adapter) and rethrow its error', async () => {
      findElementMock.mockImplementation(async () => {
        throw new Error('message');
      });

      await expect(
        pageObject.callFindUniqueDescendant('selector', truthyPredicate)
      ).rejects.toEqual(new Error('message'));
    });
  });

  describe('protected this.selectFirstDescendant(Component, predicate?)', () => {
    it('should return an instance of the specified component class', () => {
      const component = pageObject.callSelectFirstDescendant(
        ComponentClassMock,
        truthyPredicate
      );

      expect(ComponentClassMock.mock.instances.length).toBe(1);
      expect(ComponentClassMock.mock.instances[0]).toBe(component);

      expect(ComponentClassMock.mock.calls).toEqual([
        [
          [
            ...path,
            {selector: 'selector', unique: false, predicate: truthyPredicate}
          ],
          adapterMock
        ]
      ]);
    });
  });

  describe('protected this.selectUniqueDescendant(Component, predicate?)', () => {
    it('should return an instance of the specified component class', () => {
      const component = pageObject.callSelectUniqueDescendant(
        ComponentClassMock,
        truthyPredicate
      );

      expect(ComponentClassMock.mock.instances.length).toBe(1);
      expect(ComponentClassMock.mock.instances[0]).toBe(component);

      expect(ComponentClassMock.mock.calls).toEqual([
        [
          [
            ...path,
            {selector: 'selector', unique: true, predicate: truthyPredicate}
          ],
          adapterMock
        ]
      ]);
    });
  });

  describe('protected this.goto(Page)', () => {
    it('should call PageObject.goto(Page, adapter) and return its result', async () => {
      const gotoMock = jest.spyOn(PageObject, 'goto');

      try {
        const page = await pageObject.callGoto(PageClassMock);

        expect(PageClassMock.mock.instances.length).toBe(1);
        expect(PageClassMock.mock.instances[0]).toBe(page);

        expect(PageClassMock.mock.calls).toEqual([[rootPath, adapterMock]]);

        expect(gotoMock.mock.calls).toEqual([[PageClassMock, adapterMock]]);
      } finally {
        gotoMock.mockRestore();
      }
    });

    it('should call PageObject.goto(Page, adapter) and rethrow its error', async () => {
      const gotoMock = jest.spyOn(PageObject, 'goto');

      gotoMock.mockImplementation(async () => {
        throw new Error('message');
      });

      try {
        await expect(pageObject.callGoto(PageClassMock)).rejects.toEqual(
          new Error('message')
        );

        expect(PageClassMock.mock.calls.length).toBe(0);
      } finally {
        gotoMock.mockRestore();
      }
    });
  });
});
