import {AbstractPageObject, Page, Predicate} from '.';

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

class Root extends AbstractPageObject<Element> {
  public readonly selector = 'div';

  public async getName(): Promise<string | null> {
    return (await this.getElement()).getAttribute(
      `${this.constructor.name}-name`
    );
  }
}

class Child extends Root {}
class Grandchild extends Child {}

function nameEquals(name: string, size: number): Predicate<Element, Root> {
  return async (pageObject, index, pageObjects) => {
    expect(pageObjects.length).toBe(size);
    expect(pageObject).toBe(pageObjects[index]);

    return (await pageObject.getName()) === name;
  };
}

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
const root1 = root.where(nameEquals('root1', 6));
const root2 = root.where(nameEquals('root2', 6));
const root3 = root.where(nameEquals('root3', 6));

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

  describe('getElement()', () => {
    it('should fail to get the element of root', async () => {
      await expect(root.getName()).rejects.toThrow(
        'DOM element not unique (Root)'
      );
    });

    it('should get the element of root1', async () => {
      await expect(root1.getName()).resolves.toBe('root1');
    });

    it('should get the element of root2', async () => {
      await expect(root2.getName()).resolves.toBe('root2');
    });

    it('should fail to get the element of root3', async () => {
      await expect(root3.getName()).rejects.toThrow(
        'DOM element not found (Root)'
      );
    });
  });

  describe('getSize()', () => {
    it('should get the size of root', async () => {
      await expect(root.getSize()).resolves.toBe(6);
    });

    it('should get the size of root1', async () => {
      await expect(root1.getSize()).resolves.toBe(1);
    });

    it('should get the size of root2', async () => {
      await expect(root2.getSize()).resolves.toBe(1);
    });

    it('should get the size of root3', async () => {
      await expect(root3.getSize()).resolves.toBe(0);
    });
  });
});

const child = root1.select(Child);
const child1 = child.where(nameEquals('child1', 4));
const child2 = child.where(nameEquals('child2', 4));
const child3 = child.where(nameEquals('child3', 4));

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

  describe('getElement()', () => {
    it('should fail to get the element of child', async () => {
      await expect(child.getName()).rejects.toThrow(
        'DOM element not unique (Child)'
      );
    });

    it('should get the element of child1', async () => {
      await expect(child1.getName()).resolves.toBe('child1');
    });

    it('should get the element of child2', async () => {
      await expect(child2.getName()).resolves.toBe('child2');
    });

    it('should fail to get the element of child3', async () => {
      await expect(child3.getName()).rejects.toThrow(
        'DOM element not found (Child)'
      );
    });
  });

  describe('getSize()', () => {
    it('should get the size of child', async () => {
      await expect(child.getSize()).resolves.toBe(4);
    });

    it('should get the size of child1', async () => {
      await expect(child1.getSize()).resolves.toBe(1);
    });

    it('should get the size of child2', async () => {
      await expect(child2.getSize()).resolves.toBe(1);
    });

    it('should get the size of child3', async () => {
      await expect(child3.getSize()).resolves.toBe(0);
    });
  });
});

const grandchild = child2.select(Grandchild);
const grandchild1 = grandchild.where(nameEquals('grandchild1', 2));
const grandchild2 = grandchild.where(nameEquals('grandchild2', 2));
const grandchild3 = grandchild.where(nameEquals('grandchild3', 2));

describe('Grandchild', () => {
  describe('getElement()', () => {
    it('should fail to get the element of grandchild', async () => {
      await expect(grandchild.getName()).rejects.toThrow(
        'DOM element not unique (Grandchild)'
      );
    });

    it('should get the element of grandchild1', async () => {
      await expect(grandchild1.getName()).resolves.toBe('grandchild1');
    });

    it('should get the element of grandchild2', async () => {
      await expect(grandchild2.getName()).resolves.toBe('grandchild2');
    });

    it('should fail to get the element of grandchild3', async () => {
      await expect(grandchild3.getName()).rejects.toThrow(
        'DOM element not found (Grandchild)'
      );
    });
  });

  describe('getSize()', () => {
    it('should get the size of grandchild', async () => {
      await expect(grandchild.getSize()).resolves.toBe(2);
    });

    it('should get the size of grandchild1', async () => {
      await expect(grandchild1.getSize()).resolves.toBe(1);
    });

    it('should get the size of grandchild2', async () => {
      await expect(grandchild2.getSize()).resolves.toBe(1);
    });

    it('should get the size of grandchild3', async () => {
      await expect(grandchild3.getSize()).resolves.toBe(0);
    });
  });
});
