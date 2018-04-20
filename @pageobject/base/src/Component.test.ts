import {Adapter, Component, Effect, Predicate} from '.';

const {is, isGreaterThan, matches} = Predicate;

class TestAdapter implements Adapter<HTMLElement> {
  public async findNodes(
    selector: string,
    ancestor?: HTMLElement
  ): Promise<HTMLElement[]> {
    return Array.from((ancestor || document).querySelectorAll(selector));
  }
}

class DIV extends Component<HTMLElement> {
  public readonly selector: string = 'div';

  public get divs(): DIV {
    return new DIV(this.adapter, this);
  }

  public getID(): Effect<string> {
    return async () => (await this.findUniqueNode()).id;
  }
}

class Unselectable extends Component<HTMLElement> {
  public readonly selector: string = '';
}

document.body.innerHTML = `
  <div id="a1">
    <div id="b1">
      <div id="c1"></div>
      <div id="c2"></div>
    </div>
    <div id="b2"></div>
  </div>
  <div id="a2"></div>
`;

const adapter = new TestAdapter();
const unselectable = new Unselectable(adapter);
const divs = new DIV(adapter);

const a1List = [
  divs.at(1),
  divs.where(div => div.getID(), is('a1')),
  divs.where(div => div.getID(), matches(/a/)).at(1),
  divs
    .where(div => div.divs.getNodeCount(), isGreaterThan(1))
    .where(div => div.divs.at(1).getID(), is('b1'))
];

const a2List = [
  divs.at(6),
  divs.where(div => div.getID(), is('a2')),
  divs.where(div => div.getID(), matches(/a/)).at(2),
  divs.where(div => div.divs.getNodeCount(), is(0)).at(4)
];

const b1List = [
  divs.at(2),
  divs.where(div => div.getID(), is('b1')),
  divs.where(div => div.getID(), matches(/b/)).at(1),
  divs
    .where(div => div.divs.getNodeCount(), isGreaterThan(1))
    .where(div => div.divs.at(1).getID(), is('c1')),
  a1List[0].divs.at(1)
];

const b2List = [
  divs.at(5),
  divs.where(div => div.getID(), is('b2')),
  divs.where(div => div.getID(), matches(/b/)).at(2),
  divs.where(div => div.divs.getNodeCount(), is(0)).at(3),
  a1List[0].divs.at(4)
];

const notFoundList = [
  divs.at(7),
  divs.where(div => div.getID(), is('a3')),
  a1List[0].divs.at(5),
  a1List[0].divs.where(div => div.getID(), matches(/a/))
];

const ancestorNotFound = notFoundList[0].divs;
const filterNotFound = divs.where(div => div.divs.at(1).getID(), matches(/./));

const notUniqueList = [
  divs,
  divs.where(div => div.getID(), matches(/a/)),
  divs.where(div => div.divs.getNodeCount(), isGreaterThan(1)),
  divs.where(div => div.divs.getNodeCount(), is(0)),
  a1List[0].divs,
  a1List[0].divs.where(div => div.getID(), matches(/b/))
];

const ancestorNotUnique = divs.divs.at(1);
const filterNotUnique = divs.where(div => div.divs.getID(), matches(/./));

describe('Component', () => {
  describe('at()', () => {
    it('should throw an illegal-argument error', () => {
      expect(() => divs.at(0)).toThrow(
        'The specified position (0) must be one-based'
      );
    });

    it('should throw an illegal-state error', () => {
      expect(() => divs.at(1).at(2)).toThrow(
        'The existing position (1) of this <DIV> component cannot be overwritten with 2'
      );
    });
  });

  describe('findUniqueNode()', () => {
    it('should throw an illegal-argument error', async () => {
      await expect(unselectable.findUniqueNode()).rejects.toThrow(
        'The specified <Unselectable> component has no selector'
      );
    });

    it('should return an unique node', async () => {
      for (const a1 of a1List) {
        expect((await a1.findUniqueNode()).id).toBe('a1');
      }

      for (const a2 of a2List) {
        expect((await a2.findUniqueNode()).id).toBe('a2');
      }

      for (const b1 of b1List) {
        expect((await b1.findUniqueNode()).id).toBe('b1');
      }

      for (const b2 of b2List) {
        expect((await b2.findUniqueNode()).id).toBe('b2');
      }
    });

    it('should throw a component-not-found error', async () => {
      const message = 'The searched <DIV> component cannot be found';

      for (const notFound of notFoundList) {
        await expect(notFound.findUniqueNode()).rejects.toThrow(message);
      }

      await expect(ancestorNotFound.findUniqueNode()).rejects.toThrow(message);
      await expect(filterNotFound.findUniqueNode()).rejects.toThrow(message);
    });

    it('should throw a component-not-unique error', async () => {
      const message =
        'The searched <DIV> component cannot be uniquely determined';

      for (const notUnique of notUniqueList) {
        await expect(notUnique.findUniqueNode()).rejects.toThrow(message);
      }

      await expect(ancestorNotUnique.findUniqueNode()).rejects.toThrow(message);
      await expect(filterNotUnique.findUniqueNode()).rejects.toThrow(message);
    });
  });

  describe('getNodeCount() => Effect()', () => {
    it('should throw an illegal-argument error', async () => {
      await expect(unselectable.getNodeCount()()).rejects.toThrow(
        'The specified <Unselectable> component has no selector'
      );
    });

    it('should return 1', async () => {
      for (const a1 of a1List) {
        await expect(a1.getNodeCount()()).resolves.toBe(1);
      }

      for (const a2 of a2List) {
        await expect(a2.getNodeCount()()).resolves.toBe(1);
      }

      for (const b1 of b1List) {
        await expect(b1.getNodeCount()()).resolves.toBe(1);
      }

      for (const b2 of b2List) {
        await expect(b2.getNodeCount()()).resolves.toBe(1);
      }
    });

    it('should return 0', async () => {
      for (const notFound of notFoundList) {
        await expect(notFound.getNodeCount()()).resolves.toBe(0);
      }
    });

    it('should return a number greater than 1', async () => {
      for (const notUnique of notUniqueList) {
        await expect(notUnique.getNodeCount()()).resolves.toBeGreaterThan(1);
      }
    });

    it('should throw a component-not-found error', async () => {
      const message = 'The searched <DIV> component cannot be found';

      await expect(ancestorNotFound.getNodeCount()()).rejects.toThrow(message);
      await expect(filterNotFound.getNodeCount()()).rejects.toThrow(message);
    });

    it('should throw a component-not-unique error', async () => {
      const message =
        'The searched <DIV> component cannot be uniquely determined';

      await expect(ancestorNotUnique.getNodeCount()()).rejects.toThrow(message);
      await expect(filterNotUnique.getNodeCount()()).rejects.toThrow(message);
    });
  });
});
