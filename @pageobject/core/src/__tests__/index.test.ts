import {AbstractPageObject, Predicate} from '..';

class Root extends AbstractPageObject<Element> {
  public readonly selector = 'div';

  public async getName(): Promise<string | undefined> {
    const element = await this.findElement();

    return element.getAttribute(`${this.constructor.name}-name`) || undefined;
  }
}

class Child extends Root {}
class Grandchild extends Child {}

function nameEquals(name: string, length: number): Predicate<Element, Root> {
  return async (pageObject, index, pageObjects) => {
    expect(pageObjects.length).toBe(length);
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

const root = new Root(async (selector: string, parent?: Element) =>
  Array.from((parent || document.documentElement).querySelectorAll(selector))
);

const root1 = root.where(nameEquals('root1', 6));
const root2 = root.where(nameEquals('root2', 6));
const root3 = root.where(nameEquals('root3', 6));

describe('Root', () => {
  describe('findElement()', () => {
    it('should fail to find the element of root', async () => {
      await expect(root.getName()).rejects.toEqual(
        new Error('Element not unique (Root)')
      );
    });

    it('should find the element of root1', async () => {
      expect(await root1.getName()).toBe('root1');
    });

    it('should find the element of root2', async () => {
      expect(await root2.getName()).toBe('root2');
    });

    it('should fail to find the element of root3', async () => {
      await expect(root3.getName()).rejects.toEqual(
        new Error('Element not found (Root)')
      );
    });
  });

  describe('getSize()', () => {
    it('should get the size of root', async () => {
      expect(await root.getSize()).toBe(6);
    });

    it('should get the size of root1', async () => {
      expect(await root1.getSize()).toBe(1);
    });

    it('should get the size of root2', async () => {
      expect(await root2.getSize()).toBe(1);
    });

    it('should get the size of root3', async () => {
      expect(await root3.getSize()).toBe(0);
    });
  });
});

const child = root1.select(Child);
const child1 = child.where(nameEquals('child1', 4));
const child2 = child.where(nameEquals('child2', 4));
const child3 = child.where(nameEquals('child3', 4));

describe('Child', () => {
  describe('findElement()', () => {
    it('should fail to find the element of child', async () => {
      await expect(child.getName()).rejects.toEqual(
        new Error('Element not unique (Child)')
      );
    });

    it('should find the element of child1', async () => {
      expect(await child1.getName()).toBe('child1');
    });

    it('should find the element of child2', async () => {
      expect(await child2.getName()).toBe('child2');
    });

    it('should fail to find the element of child3', async () => {
      await expect(child3.getName()).rejects.toEqual(
        new Error('Element not found (Child)')
      );
    });
  });

  describe('getSize()', () => {
    it('should get the size of child', async () => {
      expect(await child.getSize()).toBe(4);
    });

    it('should get the size of child1', async () => {
      expect(await child1.getSize()).toBe(1);
    });

    it('should get the size of child2', async () => {
      expect(await child2.getSize()).toBe(1);
    });

    it('should get the size of child3', async () => {
      expect(await child3.getSize()).toBe(0);
    });
  });
});

const grandchild = child2.select(Grandchild);
const grandchild1 = grandchild.where(nameEquals('grandchild1', 2));
const grandchild2 = grandchild.where(nameEquals('grandchild2', 2));
const grandchild3 = grandchild.where(nameEquals('grandchild3', 2));

describe('Grandchild', () => {
  describe('findElement()', () => {
    it('should fail to find the element of grandchild', async () => {
      await expect(grandchild.getName()).rejects.toEqual(
        new Error('Element not unique (Grandchild)')
      );
    });

    it('should find the element of grandchild1', async () => {
      expect(await grandchild1.getName()).toBe('grandchild1');
    });

    it('should find the element of grandchild2', async () => {
      expect(await grandchild2.getName()).toBe('grandchild2');
    });

    it('should fail to find the element of grandchild3', async () => {
      await expect(grandchild3.getName()).rejects.toEqual(
        new Error('Element not found (Grandchild)')
      );
    });
  });

  describe('getSize()', () => {
    it('should get the size of grandchild', async () => {
      expect(await grandchild.getSize()).toBe(2);
    });

    it('should get the size of grandchild1', async () => {
      expect(await grandchild1.getSize()).toBe(1);
    });

    it('should get the size of grandchild2', async () => {
      expect(await grandchild2.getSize()).toBe(1);
    });

    it('should get the size of grandchild3', async () => {
      expect(await grandchild3.getSize()).toBe(0);
    });
  });
});
