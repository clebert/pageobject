import {Condition, Operator, equals} from '@pageobject/reliable';
import {Page, PageObject} from '.';

class JSDOMPage implements Page<Element> {
  public async findElements(
    selector: string,
    parent?: Element
  ): Promise<Element[]> {
    return Array.from(
      (parent || document.documentElement).querySelectorAll(selector)
    );
  }
}

class Root extends PageObject<Element> {
  public readonly selector = 'div';

  public getName(operator: Operator<string>): Condition<string | null> {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).getAttribute(
          `${this.constructor.name}-name`
        ),
      'name'
    );
  }
}

class Child extends Root {}
class Grandchild extends Child {}

document.body.innerHTML = `
  <div root-name="root1">
    <div child-name="child1"></div>
    <div child-name="child2">
      <div grandchild-name="grandchild1"></div>
      <div grandchild-name="grandchild2"></div>
    </div>
  </div>
  <div root-name="root2"></div>
`;

const root = new Root(new JSDOMPage());

const root1 = root.where(pageObject => pageObject.getName(equals('root1')));

const root2 = root.where((_, index) => {
  const condition = index(equals(5));

  expect(condition.describe()).toBe('(<index> EQUALS 5)');

  return condition;
});

const root3 = root.where(pageObject => pageObject.getName(equals('root3')));

describe('Root', () => {
  describe('select()', () => {
    it('should return a new instance using the specified constructor', () => {
      const newInstance = root.select(Child);

      expect(newInstance).not.toBe(root);
      expect(newInstance).toBeInstanceOf(Root);
      expect(newInstance).toBeInstanceOf(Child);
      expect(newInstance).not.toBeInstanceOf(Grandchild);
    });
  });

  describe('where()', () => {
    it('should return a new instance using its own constructor', () => {
      const newInstance = root.where(jest.fn());

      expect(newInstance).not.toBe(root);
      expect(newInstance).toBeInstanceOf(Root);
      expect(newInstance).not.toBeInstanceOf(Child);
      expect(newInstance).not.toBeInstanceOf(Grandchild);
    });

    it('should throw a selection-criterion-already-defined error', () => {
      expect(() => root.where(jest.fn()).where(jest.fn())).toThrow(
        'A selection criterion is already defined'
      );
    });
  });

  describe('findElement()', () => {
    it('should fail to find the element of root', async () => {
      await expect(root.findElement()).rejects.toThrow(
        'DOM element not unique (Root)'
      );
    });

    it('should find the element of root1', async () => {
      const element = await root1.findElement();

      expect(element.getAttribute('root-name')).toBe('root1');
    });

    it('should find the element of root2', async () => {
      const element = await root2.findElement();

      expect(element.getAttribute('root-name')).toBe('root2');
    });

    it('should fail to find the element of root3', async () => {
      await expect(root3.findElement()).rejects.toThrow(
        'DOM element not found (Root)'
      );
    });
  });

  describe('getSize()', () => {
    it('should return a condition that sets <size> of root to 6', async () => {
      await expect(root.getSize(equals(6)).evaluate()).resolves.toEqual({
        description: '((<size> = 6) EQUALS 6)',
        result: true
      });
    });

    it('should return a condition that sets <size> of root1 to 1', async () => {
      await expect(root1.getSize(equals(1)).evaluate()).resolves.toEqual({
        description: '((<size> = 1) EQUALS 1)',
        result: true
      });
    });

    it('should return a condition that sets <size> of root2 to 1', async () => {
      await expect(root2.getSize(equals(1)).evaluate()).resolves.toEqual({
        description: '((<size> = 1) EQUALS 1)',
        result: true
      });
    });

    it('should return a condition that sets <size> of root3 to 0', async () => {
      await expect(root3.getSize(equals(0)).evaluate()).resolves.toEqual({
        description: '((<size> = 0) EQUALS 0)',
        result: true
      });
    });
  });

  describe('isUnique()', () => {
    it('should return a condition that sets <unique> of root to false', async () => {
      await expect(root.isUnique(equals(false)).evaluate()).resolves.toEqual({
        description: '((<unique> = false) EQUALS false)',
        result: true
      });
    });

    it('should return a condition that sets <unique> of root1 to true', async () => {
      await expect(root1.isUnique(equals(true)).evaluate()).resolves.toEqual({
        description: '((<unique> = true) EQUALS true)',
        result: true
      });
    });

    it('should return a condition that sets <unique> of root2 to true', async () => {
      await expect(root2.isUnique(equals(true)).evaluate()).resolves.toEqual({
        description: '((<unique> = true) EQUALS true)',
        result: true
      });
    });

    it('should return a condition that sets <unique> of root3 to false', async () => {
      await expect(root3.isUnique(equals(false)).evaluate()).resolves.toEqual({
        description: '((<unique> = false) EQUALS false)',
        result: true
      });
    });
  });
});

const child = root1.select(Child);

const child1 = child.where(pageObject => pageObject.getName(equals('child1')));

const child2 = child.where((_, index) => {
  const condition = index(equals(1));

  expect(condition.describe()).toBe('(<index> EQUALS 1)');

  return condition;
});

const child3 = child.where(pageObject => pageObject.getName(equals('child3')));

describe('Child', () => {
  describe('select()', () => {
    it('should return a new instance using the specified constructor', () => {
      const newInstance = child.select(Grandchild);

      expect(newInstance).not.toBe(child);
      expect(newInstance).toBeInstanceOf(Root);
      expect(newInstance).toBeInstanceOf(Child);
      expect(newInstance).toBeInstanceOf(Grandchild);
    });
  });

  describe('where()', () => {
    it('should return a new instance using its own constructor', () => {
      const newInstance = child.where(jest.fn());

      expect(newInstance).not.toBe(child);
      expect(newInstance).toBeInstanceOf(Root);
      expect(newInstance).toBeInstanceOf(Child);
      expect(newInstance).not.toBeInstanceOf(Grandchild);
    });
  });

  describe('findElement()', () => {
    it('should fail to find the element of child', async () => {
      await expect(child.findElement()).rejects.toThrow(
        'DOM element not unique (Child)'
      );
    });

    it('should find the element of child1', async () => {
      const element = await child1.findElement();

      expect(element.getAttribute('child-name')).toBe('child1');
    });

    it('should find the element of child2', async () => {
      const element = await child2.findElement();

      expect(element.getAttribute('child-name')).toBe('child2');
    });

    it('should fail to find the element of child3', async () => {
      await expect(child3.findElement()).rejects.toThrow(
        'DOM element not found (Child)'
      );
    });
  });

  describe('getSize()', () => {
    it('should return a condition that sets <size> of child to 4', async () => {
      await expect(child.getSize(equals(4)).evaluate()).resolves.toEqual({
        description: '((<size> = 4) EQUALS 4)',
        result: true
      });
    });

    it('should return a condition that sets <size> of child1 to 1', async () => {
      await expect(child1.getSize(equals(1)).evaluate()).resolves.toEqual({
        description: '((<size> = 1) EQUALS 1)',
        result: true
      });
    });

    it('should return a condition that sets <size> of child2 to 1', async () => {
      await expect(child2.getSize(equals(1)).evaluate()).resolves.toEqual({
        description: '((<size> = 1) EQUALS 1)',
        result: true
      });
    });

    it('should return a condition that sets <size> of child3 to 0', async () => {
      await expect(child3.getSize(equals(0)).evaluate()).resolves.toEqual({
        description: '((<size> = 0) EQUALS 0)',
        result: true
      });
    });
  });

  describe('isUnique()', () => {
    it('should return a condition that sets <unique> of child to false', async () => {
      await expect(child.isUnique(equals(false)).evaluate()).resolves.toEqual({
        description: '((<unique> = false) EQUALS false)',
        result: true
      });
    });

    it('should return a condition that sets <unique> of child1 to true', async () => {
      await expect(child1.isUnique(equals(true)).evaluate()).resolves.toEqual({
        description: '((<unique> = true) EQUALS true)',
        result: true
      });
    });

    it('should return a condition that sets <unique> of child2 to true', async () => {
      await expect(child2.isUnique(equals(true)).evaluate()).resolves.toEqual({
        description: '((<unique> = true) EQUALS true)',
        result: true
      });
    });

    it('should return a condition that sets <unique> of child3 to false', async () => {
      await expect(child3.isUnique(equals(false)).evaluate()).resolves.toEqual({
        description: '((<unique> = false) EQUALS false)',
        result: true
      });
    });
  });
});

const grandchild = child2.select(Grandchild);

const grandchild1 = grandchild.where((_, index) => {
  const condition = index(equals(0));

  expect(condition.describe()).toBe('(<index> EQUALS 0)');

  return condition;
});

const grandchild2 = grandchild.where(pageObject =>
  pageObject.getName(equals('grandchild2'))
);

const grandchild3 = grandchild.where(pageObject =>
  pageObject.getName(equals('grandchild3'))
);

describe('Grandchild', () => {
  describe('findElement()', () => {
    it('should fail to find the element of grandchild', async () => {
      await expect(grandchild.findElement()).rejects.toThrow(
        'DOM element not unique (Grandchild)'
      );
    });

    it('should find the element of grandchild1', async () => {
      const element = await grandchild1.findElement();

      expect(element.getAttribute('grandchild-name')).toBe('grandchild1');
    });

    it('should find the element of grandchild2', async () => {
      const element = await grandchild2.findElement();

      expect(element.getAttribute('grandchild-name')).toBe('grandchild2');
    });

    it('should fail to find the element of grandchild3', async () => {
      await expect(grandchild3.findElement()).rejects.toThrow(
        'DOM element not found (Grandchild)'
      );
    });
  });

  describe('getSize()', () => {
    it('should return a condition that sets <size> of grandchild to 2', async () => {
      await expect(grandchild.getSize(equals(2)).evaluate()).resolves.toEqual({
        description: '((<size> = 2) EQUALS 2)',
        result: true
      });
    });

    it('should return a condition that sets <size> of grandchild1 to 1', async () => {
      await expect(grandchild1.getSize(equals(1)).evaluate()).resolves.toEqual({
        description: '((<size> = 1) EQUALS 1)',
        result: true
      });
    });

    it('should return a condition that sets <size> of grandchild2 to 1', async () => {
      await expect(grandchild2.getSize(equals(1)).evaluate()).resolves.toEqual({
        description: '((<size> = 1) EQUALS 1)',
        result: true
      });
    });

    it('should return a condition that sets <size> of grandchild3 to 0', async () => {
      await expect(grandchild3.getSize(equals(0)).evaluate()).resolves.toEqual({
        description: '((<size> = 0) EQUALS 0)',
        result: true
      });
    });
  });

  describe('isUnique()', () => {
    it('should return a condition that sets <unique> of grandchild to false', async () => {
      await expect(
        grandchild.isUnique(equals(false)).evaluate()
      ).resolves.toEqual({
        description: '((<unique> = false) EQUALS false)',
        result: true
      });
    });

    it('should return a condition that sets <unique> of grandchild1 to true', async () => {
      await expect(
        grandchild1.isUnique(equals(true)).evaluate()
      ).resolves.toEqual({
        description: '((<unique> = true) EQUALS true)',
        result: true
      });
    });

    it('should return a condition that sets <unique> of grandchild2 to true', async () => {
      await expect(
        grandchild2.isUnique(equals(true)).evaluate()
      ).resolves.toEqual({
        description: '((<unique> = true) EQUALS true)',
        result: true
      });
    });

    it('should return a condition that sets <unique> of grandchild3 to false', async () => {
      await expect(
        grandchild3.isUnique(equals(false)).evaluate()
      ).resolves.toEqual({
        description: '((<unique> = false) EQUALS false)',
        result: true
      });
    });
  });
});
