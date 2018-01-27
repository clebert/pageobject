import {StandardPageObject} from '.';

interface MockElement {
  readonly click: jest.Mock;
  readonly perform: jest.Mock;
  readonly type: jest.Mock;
  readonly isVisible: jest.Mock;
}

class MockPageObject extends StandardPageObject {
  public readonly selector = 'mock';
}

const erroneous = () => async () => {
  throw new Error('Element error');
};

describe('StandardPageObject', () => {
  let element: MockElement;
  let pageObject: MockPageObject;

  beforeEach(() => {
    element = {
      click: jest.fn(),
      perform: jest.fn(),
      type: jest.fn(),
      isVisible: jest.fn()
    };

    pageObject = new MockPageObject(async () => [element]);
  });

  describe('click()', () => {
    it('should click on the element', async () => {
      await pageObject.click();

      expect(element.click).toHaveBeenCalledTimes(1);
      expect(element.click).toHaveBeenLastCalledWith();
    });

    it('should fail to click on the element', async () => {
      element.click.mockImplementation(erroneous());

      await expect(pageObject.click()).rejects.toEqual(
        new Error('Element error')
      );
    });
  });

  describe('perform()', () => {
    it('should perform an action on the element', async () => {
      const action = jest.fn();

      await pageObject.perform(action);

      expect(element.perform).toHaveBeenCalledTimes(1);
      expect(element.perform).toHaveBeenLastCalledWith(action);

      await pageObject.perform(action, 'arg1', 'arg2');

      expect(element.perform).toHaveBeenCalledTimes(2);
      expect(element.perform).toHaveBeenLastCalledWith(action, 'arg1', 'arg2');
    });

    it('should fail to perform an action on the element', async () => {
      element.perform.mockImplementation(erroneous());

      await expect(pageObject.perform(jest.fn())).rejects.toEqual(
        new Error('Element error')
      );
    });
  });

  describe('type()', () => {
    it('should type into the element', async () => {
      await pageObject.type('text');

      expect(element.type).toHaveBeenCalledTimes(1);
      expect(element.type).toHaveBeenLastCalledWith('text');
    });

    it('should fail to type into the element', async () => {
      element.type.mockImplementation(erroneous());

      await expect(pageObject.type('text')).rejects.toEqual(
        new Error('Element error')
      );
    });
  });

  describe('isVisible()', () => {
    it('should get the visibility of the element', async () => {
      element.isVisible.mockImplementation(async () => true);

      await expect(pageObject.isVisible()).resolves.toBe(true);

      expect(element.isVisible).toHaveBeenCalledTimes(1);
      expect(element.isVisible).toHaveBeenLastCalledWith();
    });

    it('should fail to get the visibility of the element', async () => {
      element.isVisible.mockImplementation(erroneous());

      await expect(pageObject.isVisible()).rejects.toEqual(
        new Error('Element error')
      );
    });
  });
});
