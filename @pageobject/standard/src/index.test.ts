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

      await expect(pageObject.click()).rejects.toThrow('Element error');
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

      await expect(pageObject.perform(jest.fn())).rejects.toThrow(
        'Element error'
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

      await expect(pageObject.type('text')).rejects.toThrow('Element error');
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

      await expect(pageObject.isVisible()).rejects.toThrow('Element error');
    });
  });

  describe('getAttribute()', () => {
    it('should get an attribute of the element', async () => {
      element.perform.mockImplementation(async () => 'value');

      await expect(pageObject.getAttribute('name')).resolves.toBe('value');

      expect(element.perform).toHaveBeenCalledTimes(1);

      expect(element.perform).toHaveBeenLastCalledWith(
        expect.any(Function),
        'name'
      );

      const action = element.perform.mock.calls[0][0];
      const getAttribute = jest.fn().mockReturnValue(' value ');

      expect(action({getAttribute}, 'name')).toBe('value');

      expect(getAttribute).toHaveBeenCalledTimes(1);
      expect(getAttribute).toHaveBeenLastCalledWith('name');

      expect(
        action({getAttribute: jest.fn().mockReturnValue('')}, 'name')
      ).toBe('');

      expect(
        action({getAttribute: jest.fn().mockReturnValue(null)}, 'name')
      ).toBe(null);
    });

    it('should fail to get an attribute of the element', async () => {
      element.perform.mockImplementation(erroneous());

      await expect(pageObject.getAttribute('name')).rejects.toThrow(
        'Element error'
      );
    });
  });

  describe('getBooleanProperty()', () => {
    it('should get a boolean property of the element', async () => {
      element.perform.mockImplementation(async () => 'value');

      await expect(pageObject.getBooleanProperty('name')).resolves.toBe(
        'value'
      );

      expect(element.perform).toHaveBeenCalledTimes(1);

      expect(element.perform).toHaveBeenLastCalledWith(
        expect.any(Function),
        'name'
      );

      const action = element.perform.mock.calls[0][0];

      expect(action({name: false}, 'name')).toBe(false);
      expect(action({name: true}, 'name')).toBe(true);
      expect(action({name: 0}, 'name')).toBe(null);
      expect(action({name: 1}, 'name')).toBe(null);
      expect(action({name: ''}, 'name')).toBe(null);
      expect(action({name: 'value'}, 'name')).toBe(null);
      expect(action({name: undefined}, 'name')).toBe(null);
      expect(action({name: {}}, 'name')).toBe(null);
    });

    it('should fail to get a boolean property of the element', async () => {
      element.perform.mockImplementation(erroneous());

      await expect(pageObject.getBooleanProperty('name')).rejects.toThrow(
        'Element error'
      );
    });
  });

  describe('getNumberProperty()', () => {
    it('should get a number property of the element', async () => {
      element.perform.mockImplementation(async () => 'value');

      await expect(pageObject.getNumberProperty('name')).resolves.toBe('value');

      expect(element.perform).toHaveBeenCalledTimes(1);

      expect(element.perform).toHaveBeenLastCalledWith(
        expect.any(Function),
        'name'
      );

      const action = element.perform.mock.calls[0][0];

      expect(action({name: false}, 'name')).toBe(null);
      expect(action({name: true}, 'name')).toBe(null);
      expect(action({name: 0}, 'name')).toBe(0);
      expect(action({name: 1}, 'name')).toBe(1);
      expect(action({name: ''}, 'name')).toBe(null);
      expect(action({name: 'value'}, 'name')).toBe(null);
      expect(action({name: undefined}, 'name')).toBe(null);
      expect(action({name: {}}, 'name')).toBe(null);
    });

    it('should fail to get a number property of the element', async () => {
      element.perform.mockImplementation(erroneous());

      await expect(pageObject.getNumberProperty('name')).rejects.toThrow(
        'Element error'
      );
    });
  });

  describe('getStringProperty()', () => {
    it('should get a string property of the element', async () => {
      element.perform.mockImplementation(async () => 'value');

      await expect(pageObject.getStringProperty('name')).resolves.toBe('value');

      expect(element.perform).toHaveBeenCalledTimes(1);

      expect(element.perform).toHaveBeenLastCalledWith(
        expect.any(Function),
        'name'
      );

      const action = element.perform.mock.calls[0][0];

      expect(action({name: false}, 'name')).toBe(null);
      expect(action({name: true}, 'name')).toBe(null);
      expect(action({name: 0}, 'name')).toBe(null);
      expect(action({name: 1}, 'name')).toBe(null);
      expect(action({name: ''}, 'name')).toBe('');
      expect(action({name: 'value'}, 'name')).toBe('value');
      expect(action({name: undefined}, 'name')).toBe(null);
      expect(action({name: {}}, 'name')).toBe(null);
    });

    it('should fail to get a string property of the element', async () => {
      element.perform.mockImplementation(erroneous());

      await expect(pageObject.getStringProperty('name')).rejects.toThrow(
        'Element error'
      );
    });
  });
});
