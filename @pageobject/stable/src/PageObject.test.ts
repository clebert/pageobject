import {Condition, Operator, equals} from '@pageobject/reliable';
import {Adapter, PageObject} from '.';

class JSDOMAdapter implements Adapter<Element> {
  public async findElements(
    selector: string,
    parent?: Element
  ): Promise<Element[]> {
    return Array.from(
      (parent || document.documentElement).querySelectorAll(selector)
    );
  }
}

class A extends PageObject<Element, JSDOMAdapter> {
  public readonly selector = 'div';
}

class B extends PageObject<Element, JSDOMAdapter> {
  public readonly selector = 'p';

  public b(operator: Operator<string>): Condition<string> {
    return new Condition(
      operator,
      async () => (await this.findElement()).id,
      'b'
    );
  }
}

const adapter = new JSDOMAdapter();

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('PageObject: A', () => {
  const pageObject = new A(adapter);

  describe('nth()', () => {
    it('should throw a position-one-based error', () => {
      expect(() => pageObject.nth(0)).toThrow('Position must be one-based');
    });
  });

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

  describe('toString()', () => {
    it('should return a description', () => {
      expect(pageObject.toString()).toBe('A');
    });
  });
});

describe('PageObject: B', () => {
  const pageObject = new A(adapter).select(B);

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
        new Error('Element not found: B')
      );
    });

    it('should throw an element-not-unique error', async () => {
      document.body.innerHTML = '<div><p></p><p></p></div>';

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error('Element not unique: B')
      );
    });
  });

  describe('toString()', () => {
    it('should return a description', () => {
      expect(pageObject.toString()).toBe('B');
    });
  });
});

describe('PageObject: B[1]', () => {
  const pageObject = new A(adapter).select(B).nth(1);

  describe('nth()', () => {
    it('should throw a selection-criterion-exists error', () => {
      expect(() => pageObject.nth(1)).toThrow(
        'Selection criterion already exists: B[1]'
      );
    });
  });

  describe('where()', () => {
    it('should throw a selection-criterion-exists error', () => {
      expect(() => pageObject.where(self => self.getSize(equals(1)))).toThrow(
        'Selection criterion already exists: B[1]'
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
        new Error('Element not found: B[1]')
      );
    });
  });

  describe('toString()', () => {
    it('should return a description', () => {
      expect(pageObject.toString()).toBe('B[1]');
    });
  });
});

describe('PageObject: B[2]', () => {
  const pageObject = new A(adapter).select(B).nth(2);

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
        new Error('Element not found: B[2]')
      );
    });
  });

  describe('toString()', () => {
    it('should return a description', () => {
      expect(pageObject.toString()).toBe('B[2]');
    });
  });
});

describe("PageObject: B(b EQUALS 'b')", () => {
  const pageObject = new A(adapter).select(B).where(b => b.b(equals('b')));

  describe('nth()', () => {
    it('should throw a selection-criterion-exists error', () => {
      expect(() => pageObject.nth(1)).toThrow(
        "Selection criterion already exists: B(b EQUALS 'b')"
      );
    });
  });

  describe('where()', () => {
    it('should throw a selection-criterion-exists error', () => {
      expect(() => pageObject.where(self => self.getSize(equals(1)))).toThrow(
        "Selection criterion already exists: B(b EQUALS 'b')"
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
        new Error("Element not found: B(b EQUALS 'b')")
      );
    });

    it('should throw an element-not-unique error', async () => {
      document.body.innerHTML = '<div><p id="b"></p><p id="b"></p></div>';

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error("Element not unique: B(b EQUALS 'b')")
      );
    });

    it('should throw an element-not-matching error', async () => {
      document.body.innerHTML = '<div><p></p><p id="a"></p></div>';

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error(
          "Element not matching: B(b EQUALS 'b')\n  • ((b = '') EQUALS 'b')\n  • ((b = 'a') EQUALS 'b')"
        )
      );
    });
  });

  describe('toString()', () => {
    it('should return a description', () => {
      expect(pageObject.toString()).toBe("B(b EQUALS 'b')");
    });
  });
});
