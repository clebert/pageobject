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

class DIV extends Component<HTMLElement, TestAdapter> {
  public readonly selector: string = 'div';

  public get divs(): DIV {
    return new DIV(this.adapter, this);
  }

  public getID(): Effect<string> {
    return async () => (await this.findUniqueNode()).id;
  }

  public getNodeCount(): Effect<number> {
    return async () => (await this.findNodes()).length;
  }
}

class Unselectable extends Component<HTMLElement, TestAdapter> {
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
    it('should throw a position-base error', () => {
      expect(() => divs.at(0)).toThrow(
        'Position (0) of <DIV> component must be one-based'
      );
    });

    it('should throw a position-already-set error', () => {
      expect(() => divs.at(1).at(2)).toThrow(
        'Position (1) of <DIV> component cannot be overwritten with 2'
      );
    });
  });

  describe('findUniqueNode()', () => {
    it('should throw a no-selector error', async () => {
      await expect(unselectable.findUniqueNode()).rejects.toThrow(
        '<Unselectable> component has no selector'
      );
    });

    it('should return a unique node', async () => {
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
      const message = '<DIV> component cannot be found';

      for (const notFound of notFoundList) {
        await expect(notFound.findUniqueNode()).rejects.toThrow(message);
      }

      await expect(ancestorNotFound.findUniqueNode()).rejects.toThrow(message);
      await expect(filterNotFound.findUniqueNode()).rejects.toThrow(message);
    });

    it('should throw a component-not-unique error', async () => {
      const message = '<DIV> component cannot be uniquely determined';

      for (const notUnique of notUniqueList) {
        await expect(notUnique.findUniqueNode()).rejects.toThrow(message);
      }

      await expect(ancestorNotUnique.findUniqueNode()).rejects.toThrow(message);
      await expect(filterNotUnique.findUniqueNode()).rejects.toThrow(message);
    });
  });

  describe('findNodes()', () => {
    it('should throw a no-selector error', async () => {
      await expect(unselectable.findNodes()).rejects.toThrow(
        '<Unselectable> component has no selector'
      );
    });

    it('should return an array with one node', async () => {
      for (const a1 of a1List) {
        expect((await a1.findNodes()).length).toBe(1);
      }

      for (const a2 of a2List) {
        expect((await a2.findNodes()).length).toBe(1);
      }

      for (const b1 of b1List) {
        expect((await b1.findNodes()).length).toBe(1);
      }

      for (const b2 of b2List) {
        expect((await b2.findNodes()).length).toBe(1);
      }
    });

    it('should return an empty array', async () => {
      for (const notFound of notFoundList) {
        expect((await notFound.findNodes()).length).toBe(0);
      }
    });

    it('should return an array with more than one node', async () => {
      for (const notUnique of notUniqueList) {
        expect((await notUnique.findNodes()).length).toBeGreaterThan(1);
      }
    });

    it('should throw a component-not-found error', async () => {
      const message = '<DIV> component cannot be found';

      await expect(ancestorNotFound.findNodes()).rejects.toThrow(message);
      await expect(filterNotFound.findNodes()).rejects.toThrow(message);
    });

    it('should throw a component-not-unique error', async () => {
      const message = '<DIV> component cannot be uniquely determined';

      await expect(ancestorNotUnique.findNodes()).rejects.toThrow(message);
      await expect(filterNotUnique.findNodes()).rejects.toThrow(message);
    });
  });
});
