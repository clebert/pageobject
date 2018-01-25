import {StandardPageObject} from '.';

interface MockElement {
  readonly click: jest.Mock;
  readonly type: jest.Mock;
  readonly getAttribute: jest.Mock;
  readonly getHTML: jest.Mock;
  readonly getProperty: jest.Mock;
  readonly getTagName: jest.Mock;
  readonly getText: jest.Mock;
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
      type: jest.fn(),
      getAttribute: jest.fn(),
      getHTML: jest.fn(),
      getProperty: jest.fn(),
      getTagName: jest.fn(),
      getText: jest.fn(),
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

  describe('getAttribute()', () => {
    it('should get an attribute of the element', async () => {
      element.getAttribute.mockImplementation(async () => 'value');

      await expect(pageObject.getAttribute('name')).resolves.toBe('value');

      expect(element.getAttribute).toHaveBeenCalledTimes(1);
      expect(element.getAttribute).toHaveBeenLastCalledWith('name');
    });

    it('should fail to get an attribute of the element', async () => {
      element.getAttribute.mockImplementation(erroneous());

      await expect(pageObject.getAttribute('name')).rejects.toEqual(
        new Error('Element error')
      );
    });
  });

  describe('getHTML()', () => {
    it('should get the HTML of the element', async () => {
      element.getHTML.mockImplementation(async () => 'html');

      await expect(pageObject.getHTML()).resolves.toBe('html');

      expect(element.getHTML).toHaveBeenCalledTimes(1);
      expect(element.getHTML).toHaveBeenLastCalledWith();
    });

    it('should fail to get the HTML of the element', async () => {
      element.getHTML.mockImplementation(erroneous());

      await expect(pageObject.getHTML()).rejects.toEqual(
        new Error('Element error')
      );
    });
  });

  describe('getProperty()', () => {
    it('should get a property of the element', async () => {
      element.getProperty.mockImplementation(async () => 'value');

      await expect(pageObject.getProperty('name')).resolves.toBe('value');

      expect(element.getProperty).toHaveBeenCalledTimes(1);
      expect(element.getProperty).toHaveBeenLastCalledWith('name');
    });

    it('should fail to get a property of the element', async () => {
      element.getProperty.mockImplementation(erroneous());

      await expect(pageObject.getProperty('name')).rejects.toEqual(
        new Error('Element error')
      );
    });
  });

  describe('getTagName()', () => {
    it('should get the tag name of the element', async () => {
      element.getTagName.mockImplementation(async () => 'tag name');

      await expect(pageObject.getTagName()).resolves.toBe('tag name');

      expect(element.getTagName).toHaveBeenCalledTimes(1);
      expect(element.getTagName).toHaveBeenLastCalledWith();
    });

    it('should fail to get the tag name of the element', async () => {
      element.getTagName.mockImplementation(erroneous());

      await expect(pageObject.getTagName()).rejects.toEqual(
        new Error('Element error')
      );
    });
  });

  describe('getText()', () => {
    it('should get the text of the element', async () => {
      element.getText.mockImplementation(async () => 'text');

      await expect(pageObject.getText()).resolves.toBe('text');

      expect(element.getText).toHaveBeenCalledTimes(1);
      expect(element.getText).toHaveBeenLastCalledWith();
    });

    it('should fail to get the text of the element', async () => {
      element.getText.mockImplementation(erroneous());

      await expect(pageObject.getText()).rejects.toEqual(
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
