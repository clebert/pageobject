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

  public b(operator: Operator<string>): Condition {
    return new Condition(
      operator,
      async () => (await this.findElement()).id,
      'b'
    );
  }
}

class C extends PageObject<Element, JSDOMAdapter> {
  public readonly selector = 'span';
}

const adapter = new JSDOMAdapter();

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('PageObject: A', () => {
  const existingHTML = '<div></div>';
  const notFoundHTML = '';
  const notUniqueHTML = '<div></div><div></div>';

  const pageObject = new A(adapter);

  describe('nth()', () => {
    it('should throw a position-one-based error', () => {
      expect(() => pageObject.nth(0)).toThrow('Position must be one-based');
    });
  });

  describe('getSize()', () => {
    it('should return a condition that sets <size> to 1', async () => {
      document.body.innerHTML = existingHTML;

      const condition = pageObject.getSize(equals(1));

      expect(condition.valueName).toBe('size');

      await expect(condition.test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 0', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.getSize(equals(0)).test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 2', async () => {
      document.body.innerHTML = notUniqueHTML;

      await expect(pageObject.getSize(equals(2)).test()).resolves.toBe(true);
    });
  });

  describe('isExisting()', () => {
    it('should return a condition that sets <existing> to true', async () => {
      document.body.innerHTML = existingHTML;

      const condition = pageObject.isExisting();

      expect(condition.valueName).toBe('existing');

      await expect(condition.test()).resolves.toBe(true);
    });

    it('should return a condition that sets <existing> to false', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.isExisting(equals(false)).test()).resolves.toBe(
        true
      );

      document.body.innerHTML = notUniqueHTML;

      await expect(pageObject.isExisting(equals(false)).test()).resolves.toBe(
        true
      );
    });
  });

  describe('findElement()', () => {
    it('should return an element', async () => {
      document.body.innerHTML = existingHTML;

      await expect(pageObject.findElement()).resolves.toBe(
        document.querySelector('div')
      );
    });

    it('should throw an element-not-found error', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error('Element not found: A')
      );
    });

    it('should throw an element-not-unique error', async () => {
      document.body.innerHTML = notUniqueHTML;

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

describe('PageObject: A > B', () => {
  const existingHTML = '<p></p><div><p></p></div>';
  const notFoundHTML = '<div></div>';
  const notUniqueHTML = '<div><p></p><p></p></div>';

  const pageObject = new A(adapter).select(B);

  describe('getSize()', () => {
    it('should return a condition that sets <size> to 1', async () => {
      document.body.innerHTML = existingHTML;

      await expect(pageObject.getSize(equals(1)).test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 0', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.getSize(equals(0)).test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 2', async () => {
      document.body.innerHTML = notUniqueHTML;

      await expect(pageObject.getSize(equals(2)).test()).resolves.toBe(true);
    });
  });

  describe('isExisting()', () => {
    it('should return a condition that sets <existing> to true', async () => {
      document.body.innerHTML = existingHTML;

      await expect(pageObject.isExisting().test()).resolves.toBe(true);
    });

    it('should return a condition that sets <existing> to false', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.isExisting(equals(false)).test()).resolves.toBe(
        true
      );

      document.body.innerHTML = notUniqueHTML;

      await expect(pageObject.isExisting(equals(false)).test()).resolves.toBe(
        true
      );
    });
  });

  describe('findElement()', () => {
    it('should return an element', async () => {
      document.body.innerHTML = existingHTML;

      await expect(pageObject.findElement()).resolves.toBe(
        document.querySelector('div > p')
      );
    });

    it('should throw an element-not-found error', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error('Element not found: A > B')
      );
    });

    it('should throw an element-not-unique error', async () => {
      document.body.innerHTML = notUniqueHTML;

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error('Element not unique: A > B')
      );
    });
  });

  describe('toString()', () => {
    it('should return a description', () => {
      expect(pageObject.toString()).toBe('A > B');
    });
  });
});

describe('PageObject: A > B[1]', () => {
  const existingHTML = '<p></p><div><p></p><p></p></div>';
  const notFoundHTML = '<div></div>';

  const pageObject = new A(adapter).select(B).nth(1);

  describe('nth()', () => {
    it('should throw a selection-criterion-exists error', () => {
      expect(() => pageObject.nth(1)).toThrow(
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
      document.body.innerHTML = existingHTML;

      await expect(pageObject.getSize(equals(1)).test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 0', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.getSize(equals(0)).test()).resolves.toBe(true);
    });
  });

  describe('isExisting()', () => {
    it('should return a condition that sets <existing> to true', async () => {
      document.body.innerHTML = existingHTML;

      await expect(pageObject.isExisting().test()).resolves.toBe(true);
    });

    it('should return a condition that sets <existing> to false', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.isExisting(equals(false)).test()).resolves.toBe(
        true
      );
    });
  });

  describe('findElement()', () => {
    it('should return an element', async () => {
      document.body.innerHTML = existingHTML;

      await expect(pageObject.findElement()).resolves.toBe(
        document.querySelector('div > p:nth-child(1)')
      );
    });

    it('should throw an element-not-found error', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error('Element not found: A > B[1]')
      );
    });
  });

  describe('toString()', () => {
    it('should return a description', () => {
      expect(pageObject.toString()).toBe('A > B[1]');
    });
  });
});

describe('PageObject: A > B[2]', () => {
  const existingHTML = '<p></p><div><p></p><p></p></div>';
  const notFoundHTML = '<div><p></p></div>';

  const pageObject = new A(adapter).select(B).nth(2);

  describe('getSize()', () => {
    it('should return a condition that sets <size> to 1', async () => {
      document.body.innerHTML = existingHTML;

      await expect(pageObject.getSize(equals(1)).test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 0', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.getSize(equals(0)).test()).resolves.toBe(true);
    });
  });

  describe('isExisting()', () => {
    it('should return a condition that sets <existing> to true', async () => {
      document.body.innerHTML = existingHTML;

      await expect(pageObject.isExisting().test()).resolves.toBe(true);
    });

    it('should return a condition that sets <existing> to false', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.isExisting(equals(false)).test()).resolves.toBe(
        true
      );
    });
  });

  describe('findElement()', () => {
    it('should return an element', async () => {
      document.body.innerHTML = existingHTML;

      await expect(pageObject.findElement()).resolves.toBe(
        document.querySelector('p:nth-child(2)')
      );
    });

    it('should throw an element-not-found error', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error('Element not found: A > B[2]')
      );
    });
  });

  describe('toString()', () => {
    it('should return a description', () => {
      expect(pageObject.toString()).toBe('A > B[2]');
    });
  });
});

describe("PageObject: A > B(b EQUALS 'b')", () => {
  const existingHTML = '<p id="b"></p><div><p></p><p id="b"></p></div>';
  const notFoundHTML = '<div></div>';
  const notUniqueHTML = '<div><p id="b"></p><p id="b"></p></div>';
  const notMatching = '<div><p id="a"></p><p></p></div>';

  const pageObject = new A(adapter).select(B).where(b => b.b(equals('b')));

  describe('nth()', () => {
    it('should throw a selection-criterion-exists error', () => {
      expect(() => pageObject.nth(1)).toThrow(
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
      document.body.innerHTML = existingHTML;

      await expect(pageObject.getSize(equals(1)).test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 0', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.getSize(equals(0)).test()).resolves.toBe(true);

      document.body.innerHTML = notMatching;

      await expect(pageObject.getSize(equals(0)).test()).resolves.toBe(true);
    });

    it('should return a condition that sets <size> to 2', async () => {
      document.body.innerHTML = notUniqueHTML;

      await expect(pageObject.getSize(equals(2)).test()).resolves.toBe(true);
    });
  });

  describe('isExisting()', () => {
    it('should return a condition that sets <existing> to true', async () => {
      document.body.innerHTML = existingHTML;

      await expect(pageObject.isExisting().test()).resolves.toBe(true);
    });

    it('should return a condition that sets <existing> to false', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.isExisting(equals(false)).test()).resolves.toBe(
        true
      );

      document.body.innerHTML = notUniqueHTML;

      await expect(pageObject.isExisting(equals(false)).test()).resolves.toBe(
        true
      );

      document.body.innerHTML = notMatching;

      await expect(pageObject.isExisting(equals(false)).test()).resolves.toBe(
        true
      );
    });
  });

  describe('findElement()', () => {
    it('should return an element', async () => {
      document.body.innerHTML = existingHTML;

      await expect(pageObject.findElement()).resolves.toBe(
        document.querySelector('div > #b')
      );
    });

    it('should throw an element-not-found error', async () => {
      document.body.innerHTML = notFoundHTML;

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error("Element not found: A > B(b EQUALS 'b')")
      );
    });

    it('should throw an element-not-unique error', async () => {
      document.body.innerHTML = notUniqueHTML;

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error("Element not unique: A > B(b EQUALS 'b')")
      );
    });

    it('should throw an element-not-matching error', async () => {
      document.body.innerHTML = notMatching;

      await expect(pageObject.findElement()).rejects.toEqual(
        new Error(
          [
            "Element not matching: A > B(b EQUALS 'b')",
            "  • Comparison failed: ((b = 'a') EQUALS 'b')",
            "  • Comparison failed: ((b = '') EQUALS 'b')"
          ].join('\n')
        )
      );
    });
  });

  describe('toString()', () => {
    it('should return a description', () => {
      expect(pageObject.toString()).toBe("A > B(b EQUALS 'b')");
    });
  });
});

describe("PageObject: A[1] > B(b EQUALS 'b') > C", () => {
  const pageObject = new A(adapter)
    .nth(1)
    .select(B)
    .where(b => b.b(equals('b')))
    .select(C);

  describe('toString()', () => {
    it('should return a description', () => {
      expect(pageObject.toString()).toBe("A[1] > B(b EQUALS 'b') > C");
    });
  });
});
