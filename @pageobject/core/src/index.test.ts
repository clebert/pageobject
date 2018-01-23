import {AbstractPageObject, Predicate, perform} from '.';

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

const root = new Root(async (selector: string, parent?: Element) =>
  Array.from((parent || document.documentElement).querySelectorAll(selector))
);

const root1 = root.where(nameEquals('root1', 6));
const root2 = root.where(nameEquals('root2', 6));
const root3 = root.where(nameEquals('root3', 6));

describe('Root', () => {
  describe('select()', () => {
    it('should return a new instance using the given constructor', () => {
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
  });

  describe('getElement()', () => {
    it('should fail to get the element of root', async () => {
      await expect(root.getName()).rejects.toEqual(
        new Error('Element not unique (Root)')
      );
    });

    it('should get the element of root1', async () => {
      expect(await root1.getName()).toBe('root1');
    });

    it('should get the element of root2', async () => {
      expect(await root2.getName()).toBe('root2');
    });

    it('should fail to get the element of root3', async () => {
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
  describe('select()', () => {
    it('should return a new instance using the given constructor', () => {
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
      await expect(child.getName()).rejects.toEqual(
        new Error('Element not unique (Child)')
      );
    });

    it('should get the element of child1', async () => {
      expect(await child1.getName()).toBe('child1');
    });

    it('should get the element of child2', async () => {
      expect(await child2.getName()).toBe('child2');
    });

    it('should fail to get the element of child3', async () => {
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
  describe('getElement()', () => {
    it('should fail to get the element of grandchild', async () => {
      await expect(grandchild.getName()).rejects.toEqual(
        new Error('Element not unique (Grandchild)')
      );
    });

    it('should get the element of grandchild1', async () => {
      expect(await grandchild1.getName()).toBe('grandchild1');
    });

    it('should get the element of grandchild2', async () => {
      expect(await grandchild2.getName()).toBe('grandchild2');
    });

    it('should fail to get the element of grandchild3', async () => {
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

class ObservablePromise<T> {
  public readonly promise: Promise<T>;

  private _pending = true;

  public constructor(promise: Promise<T>) {
    this.promise = (async () => {
      try {
        return await promise;
      } finally {
        this._pending = false;
      }
    })();
  }

  public async isPending(): Promise<boolean> {
    for (let i = 0; i < 100; i += 1) {
      await Promise.resolve();
    }

    return this._pending;
  }
}

async function observeTimeout<T>(
  performable: () => Promise<T>,
  value: number
): Promise<void> {
  jest.useFakeTimers();

  try {
    const performance = new ObservablePromise(performable());

    for (let i = 0; i < value; i += 1) {
      jest.runAllTicks();
      jest.runAllImmediates();
      jest.advanceTimersByTime(1);

      if ((await performance.isPending()) !== i + 1 < value) {
        throw new Error('To early timeout');
      }
    }

    await performance.promise;
  } finally {
    jest.useRealTimers();
  }
}

describe('perform()', () => {
  const explicitTimeout = 10;
  const implicitTimeout = 20;

  const erroneous = (n?: number) => async () => {
    throw new Error(n !== undefined ? `Action error ${n}` : 'Action error');
  };

  const neverending = async () => new Promise<void>(() => undefined);

  beforeEach(() => {
    process.env.IMPLICIT_TIMEOUT = String(implicitTimeout);
  });

  afterEach(() => {
    process.env.IMPLICIT_TIMEOUT = undefined;
  });

  it('should throw a missing timeout-value error', async () => {
    process.env.IMPLICIT_TIMEOUT = undefined;

    await expect(perform(jest.fn())).rejects.toEqual(
      new Error('Please specify an explicit or implicit timeout value')
    );
  });

  it('should throw an invalid timeout-value error', async () => {
    await expect(perform(jest.fn(), NaN)).rejects.toEqual(
      new Error('Invalid timeout value')
    );

    process.env.IMPLICIT_TIMEOUT = 'NaN';

    await expect(perform(jest.fn())).rejects.toEqual(
      new Error('Invalid timeout value')
    );
  });

  it('should perform the given action using an explicit timeout', async () => {
    const action = jest
      .fn()
      .mockImplementationOnce(erroneous())
      .mockImplementation(async () => 'result');

    expect(await perform(action, explicitTimeout)).toBe('result');

    expect(action).toHaveBeenCalledTimes(2);
  });

  it('should perform the given action using an implicit timeout', async () => {
    const action = jest
      .fn()
      .mockImplementationOnce(erroneous())
      .mockImplementation(async () => 'result');

    expect(await perform(action)).toBe('result');

    expect(action).toHaveBeenCalledTimes(2);
  });

  it('should fail to perform the given action using an explicit timeout', async () => {
    const action = jest
      .fn()
      .mockImplementationOnce(erroneous(1))
      .mockImplementationOnce(erroneous(2))
      .mockImplementation(neverending);

    await expect(
      observeTimeout(
        async () => perform(action, explicitTimeout),
        explicitTimeout
      )
    ).rejects.toEqual(new Error('Action error 2'));

    expect(action).toHaveBeenCalledTimes(3);
  });

  it('should fail to perform the given action using an implicit timeout', async () => {
    const action = jest
      .fn()
      .mockImplementationOnce(erroneous(1))
      .mockImplementationOnce(erroneous(2))
      .mockImplementation(neverending);

    await expect(
      observeTimeout(async () => perform(action), implicitTimeout)
    ).rejects.toEqual(new Error('Action error 2'));

    expect(action).toHaveBeenCalledTimes(3);
  });

  it('should not throw an out-of-memory error', async () => {
    const action = jest.fn().mockImplementation(erroneous());

    await expect(perform(action)).rejects.toEqual(new Error('Action error'));
  });
});
