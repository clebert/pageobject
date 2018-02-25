import {Condition, Operator, equals} from '@pageobject/reliable';
import {Browser, PageObject} from '.';

class JSDOMBrowser implements Browser<Element> {
  public async findElements(
    selector: string,
    parent?: Element
  ): Promise<Element[]> {
    return Array.from(
      (parent || document.documentElement).querySelectorAll(selector)
    );
  }
}

class A extends PageObject<Element, JSDOMBrowser> {
  public readonly selector = 'div';
}

class B extends PageObject<Element, JSDOMBrowser> {
  public readonly selector = 'p';

  public b(operator: Operator<string>): Condition<string> {
    return new Condition(
      operator,
      async () => (await this.findElement()).id,
      'b'
    );
  }
}

const browser = new JSDOMBrowser();

beforeEach(() => {
  document.body.innerHTML = '';
});

/*
Tested:

A
A > B
A > B[0]
A > B[1]
A > B(b EQUALS 'b')

Not tested:

A(a EQUALS 'a')
A(a EQUALS 'a') > B
A(a EQUALS 'a') > B[0]
A(a EQUALS 'a') > B[1]
A(a EQUALS 'a') > B(b EQUALS 'b')

A[0]
A[0] > B
A[0] > B[0]
A[0] > B[1]
A[0] > B(b EQUALS 'b')

A[1]
A[1] > B
A[1] > B[0]
A[1] > B[1]
A[1] > B(b EQUALS 'b')
*/

describe('PageObject: A', () => {
  const pageObject = new A(browser);

  describe('getSize()', () => {
    it('should return a condition that sets <size> to 1', async () => {
      document.body.innerHTML = '<div></div>';

      const condition = pageObject.getSize(equals(1));

      expect(condition.valueName).toBe('size');

      await expect(condition.test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 0', async () => {
      await expect(pageObject.getSize(equals(0)).test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 2', async () => {
      document.body.innerHTML = '<div></div><div></div>';

      await expect(pageObject.getSize(equals(2)).test()).resolves.toBe(true);
    });
  });

  describe('findElement()', () => {
    it('should return an element', async () => {
      document.body.innerHTML = '<div></div>';

      await expect(pageObject.findElement()).resolves.toBe(
        document.querySelector('div')
      );
    });

    it('should throw an element-not-found error', async () => {
      await expect(pageObject.findElement()).rejects.toEqual(
        new Error('Element not found: A')
      );
    });

    it('should throw an element-not-unique error', async () => {
      document.body.innerHTML = '<div></div><div></div>';

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error('Element not unique: A')
      );
    });
  });
});

describe('PageObject: A > B', () => {
  const pageObject = new A(browser).select(B);

  describe('getSize()', () => {
    it('should return a condition that sets <size> to 1', async () => {
      document.body.innerHTML = '<p></p><div><p></p></div>';

      const condition = pageObject.getSize(equals(1));

      expect(condition.valueName).toBe('size');

      await expect(condition.test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 0', async () => {
      document.body.innerHTML = '<div></div>';

      await expect(pageObject.getSize(equals(0)).test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 2', async () => {
      document.body.innerHTML = '<div><p></p><p></p></div>';

      await expect(pageObject.getSize(equals(2)).test()).resolves.toBe(true);
    });
  });

  describe('findElement()', () => {
    it('should return an element', async () => {
      document.body.innerHTML = '<p></p><div><p></p></div>';

      await expect(pageObject.findElement()).resolves.toBe(
        document.querySelector('div > p')
      );
    });

    it('should throw an element-not-found error', async () => {
      document.body.innerHTML = '<div></div>';

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error('Element not found: A > B')
      );
    });

    it('should throw an element-not-unique error', async () => {
      document.body.innerHTML = '<div><p></p><p></p></div>';

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error('Element not unique: A > B')
      );
    });
  });
});

describe('PageObject: A > B[0]', () => {
  const pageObject = new A(browser).select(B).at(0);

  describe('at()', () => {
    it('should throw a selection-criterion-exists error', () => {
      expect(() => pageObject.at(1)).toThrow(
        'Selection criterion already exists: A > B[0]'
      );
    });
  });

  describe('where()', () => {
    it('should throw a selection-criterion-exists error', () => {
      expect(() => pageObject.where(self => self.getSize(equals(1)))).toThrow(
        'Selection criterion already exists: A > B[0]'
      );
    });
  });

  describe('getSize()', () => {
    it('should return a condition that sets <size> to 1', async () => {
      document.body.innerHTML = '<p></p><div><p></p><p></p></div>';

      const condition = pageObject.getSize(equals(1));

      expect(condition.valueName).toBe('size');

      await expect(condition.test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 0', async () => {
      document.body.innerHTML = '<div></div>';

      await expect(pageObject.getSize(equals(0)).test()).resolves.toBe(true);
    });
  });

  describe('findElement()', () => {
    it('should return an element', async () => {
      document.body.innerHTML = '<p></p><div><p></p><p></p></div>';

      await expect(pageObject.findElement()).resolves.toBe(
        document.querySelector('div > p:nth-child(1)')
      );
    });

    it('should throw an element-not-found error', async () => {
      document.body.innerHTML = '<div></div>';

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error('Element not found: A > B[0]')
      );
    });
  });
});

describe('PageObject: A > B[1]', () => {
  const pageObject = new A(browser).select(B).at(1);

  describe('at()', () => {
    it('should throw a selection-criterion-exists error', () => {
      expect(() => pageObject.at(0)).toThrow(
        'Selection criterion already exists: A > B[1]'
      );
    });
  });

  describe('where()', () => {
    it('should throw a selection-criterion-exists error', () => {
      expect(() => pageObject.where(self => self.getSize(equals(1)))).toThrow(
        'Selection criterion already exists: A > B[1]'
      );
    });
  });

  describe('getSize()', () => {
    it('should return a condition that sets <size> to 1', async () => {
      document.body.innerHTML = '<p></p><div><p></p><p></p></div>';

      const condition = pageObject.getSize(equals(1));

      expect(condition.valueName).toBe('size');

      await expect(condition.test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 0', async () => {
      document.body.innerHTML = '<div><p></p></div>';

      await expect(pageObject.getSize(equals(0)).test()).resolves.toBe(true);
    });
  });

  describe('findElement()', () => {
    it('should return an element', async () => {
      document.body.innerHTML = '<p></p><div><p></p><p></p></div>';

      await expect(pageObject.findElement()).resolves.toBe(
        document.querySelector('p:nth-child(2)')
      );
    });

    it('should throw an element-not-found error', async () => {
      document.body.innerHTML = '<div><p></p></div>';

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error('Element not found: A > B[1]')
      );
    });
  });
});

describe("PageObject: A > B(b EQUALS 'b')", () => {
  const pageObject = new A(browser).select(B).where(b => b.b(equals('b')));

  describe('at()', () => {
    it('should throw a selection-criterion-exists error', () => {
      expect(() => pageObject.at(0)).toThrow(
        "Selection criterion already exists: A > B(b EQUALS 'b')"
      );
    });
  });

  describe('where()', () => {
    it('should throw a selection-criterion-exists error', () => {
      expect(() => pageObject.where(self => self.getSize(equals(1)))).toThrow(
        "Selection criterion already exists: A > B(b EQUALS 'b')"
      );
    });
  });

  describe('getSize()', () => {
    it('should return a condition that sets <size> to 1', async () => {
      document.body.innerHTML =
        '<p id="b"></p><div><p id="b"></p><p></p></div>';

      const condition = pageObject.getSize(equals(1));

      expect(condition.valueName).toBe('size');

      await expect(condition.test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 0', async () => {
      document.body.innerHTML = '<div></div>';

      await expect(pageObject.getSize(equals(0)).test()).resolves.toBe(true);

      document.body.innerHTML = '<div><p></p><p id="a"></p></div>';

      await expect(pageObject.getSize(equals(0)).test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 2', async () => {
      document.body.innerHTML = '<div><p id="b"></p><p id="b"></p></div>';

      await expect(pageObject.getSize(equals(2)).test()).resolves.toBe(true);
    });
  });

  describe('findElement()', () => {
    it('should return an element', async () => {
      document.body.innerHTML =
        '<p id="b"></p><div><p id="b"></p><p></p></div>';

      await expect(pageObject.findElement()).resolves.toBe(
        document.querySelector('div > #b')
      );
    });

    it('should throw an element-not-found error', async () => {
      document.body.innerHTML = '<div></div>';

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error("Element not found: A > B(b EQUALS 'b')")
      );
    });

    it('should throw an element-not-unique error', async () => {
      document.body.innerHTML = '<div><p id="b"></p><p id="b"></p></div>';

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error("Element not unique: A > B(b EQUALS 'b')")
      );
    });

    it('should throw an element-not-matching error', async () => {
      document.body.innerHTML = '<div><p></p><p id="a"></p></div>';

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error(
          "Element not matching: A > B(b EQUALS 'b')\n  • ((b = '') EQUALS 'b')\n  • ((b = 'a') EQUALS 'b')"
        )
      );
    });
  });
});
