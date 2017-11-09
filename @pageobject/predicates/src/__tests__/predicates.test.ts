/* tslint:disable no-any */

import {AdapterMock, Predicate} from '@pageobject/class';
import {
  and,
  atIndex,
  attributeContains,
  attributeEquals,
  attributeMatches,
  htmlContains,
  htmlEquals,
  htmlMatches,
  not,
  or,
  textContains,
  textEquals,
  textMatches,
  xor
} from '..';

let predicate: Predicate<object, AdapterMock<object>>;

let adapterMock: AdapterMock<object>;
let errorPredicateMock: jest.Mock<Promise<boolean>>;
let falsyPredicateMock: jest.Mock<Promise<boolean>>;
let truthyPredicateMock: jest.Mock<Promise<boolean>>;
let getAttributeMock: jest.Mock<string>;
let getHtmlMock: jest.Mock<string>;
let getTextMock: jest.Mock<string>;
let elementMocks: jest.Mock<object>[];

beforeEach(async () => {
  adapterMock = new AdapterMock();

  adapterMock.evaluate.mockImplementation(async (script, ...args) =>
    script(...args)
  );

  errorPredicateMock = jest.fn(async () => {
    throw new Error('message');
  });

  falsyPredicateMock = jest.fn(async () => false);
  truthyPredicateMock = jest.fn(async () => true);

  getAttributeMock = jest.fn();
  getHtmlMock = jest.fn();
  getTextMock = jest.fn();

  elementMocks = [{getAttribute: getAttributeMock} as any];

  Object.defineProperty(elementMocks[0], 'innerHTML', {get: getHtmlMock});
  Object.defineProperty(elementMocks[0], 'innerText', {get: getTextMock});
});

describe('not(predicate)', () => {
  it('should return a predicate that returns true', async () => {
    expect(
      await not(falsyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(true);

    expect(falsyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);
  });

  it('should return a predicate that returns false', async () => {
    expect(
      await not(truthyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(false);

    expect(truthyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);
  });

  it('should call the predicate and rethrow its error', async () => {
    await expect(
      not(errorPredicateMock)(adapterMock, elementMocks[0], 0, elementMocks)
    ).rejects.toEqual(new Error('message'));
  });
});

describe('and(predicateA, predicateB)', () => {
  it('should return a predicate that returns true', async () => {
    expect(
      await and(truthyPredicateMock, truthyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(true);

    expect(truthyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks],
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);
  });

  it('should return a predicate that returns false', async () => {
    expect(
      await and(falsyPredicateMock, falsyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(false);

    expect(falsyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);

    falsyPredicateMock.mockClear();

    expect(
      await and(falsyPredicateMock, truthyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(false);

    expect(falsyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);

    expect(truthyPredicateMock.mock.calls).toEqual([]);

    falsyPredicateMock.mockClear();
    truthyPredicateMock.mockClear();

    expect(
      await and(truthyPredicateMock, falsyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(false);

    expect(falsyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);

    expect(truthyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);
  });

  it('should call the predicateA and rethrow its error', async () => {
    await expect(
      and(errorPredicateMock, truthyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).rejects.toEqual(new Error('message'));
  });

  it('should call the predicateB and rethrow its error', async () => {
    await expect(
      and(truthyPredicateMock, errorPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).rejects.toEqual(new Error('message'));
  });
});

describe('or(predicateA, predicateB)', () => {
  it('should return a predicate that returns true', async () => {
    expect(
      await or(falsyPredicateMock, truthyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(true);

    expect(falsyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);

    expect(truthyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);

    falsyPredicateMock.mockClear();
    truthyPredicateMock.mockClear();

    expect(
      await or(truthyPredicateMock, falsyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(true);

    expect(falsyPredicateMock.mock.calls).toEqual([]);

    expect(truthyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);

    truthyPredicateMock.mockClear();

    expect(
      await or(truthyPredicateMock, truthyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(true);

    expect(truthyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);
  });

  it('should return a predicate that returns false', async () => {
    expect(
      await or(falsyPredicateMock, falsyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(false);

    expect(falsyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks],
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);
  });

  it('should call the predicateA and rethrow its error', async () => {
    await expect(
      or(errorPredicateMock, truthyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).rejects.toEqual(new Error('message'));
  });

  it('should call the predicateB and rethrow its error', async () => {
    await expect(
      or(falsyPredicateMock, errorPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).rejects.toEqual(new Error('message'));
  });
});

describe('xor(predicateA, predicateB)', () => {
  it('should return a predicate that returns true', async () => {
    expect(
      await xor(falsyPredicateMock, truthyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(true);

    expect(falsyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);

    expect(truthyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);

    falsyPredicateMock.mockClear();
    truthyPredicateMock.mockClear();

    expect(
      await xor(truthyPredicateMock, falsyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(true);

    expect(falsyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);

    expect(truthyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);
  });

  it('should return a predicate that returns false', async () => {
    expect(
      await xor(falsyPredicateMock, falsyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(false);

    expect(falsyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks],
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);

    expect(
      await xor(truthyPredicateMock, truthyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).toBe(false);

    expect(truthyPredicateMock.mock.calls).toEqual([
      [adapterMock, elementMocks[0], 0, elementMocks],
      [adapterMock, elementMocks[0], 0, elementMocks]
    ]);
  });

  it('should call the predicateA and rethrow its error', async () => {
    await expect(
      xor(errorPredicateMock, truthyPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).rejects.toEqual(new Error('message'));
  });

  it('should call the predicateB and rethrow its error', async () => {
    await expect(
      xor(truthyPredicateMock, errorPredicateMock)(
        adapterMock,
        elementMocks[0],
        0,
        elementMocks
      )
    ).rejects.toEqual(new Error('message'));
  });
});

describe('atIndex(n)', () => {
  beforeEach(() => {
    predicate = atIndex(1);
  });

  it('should return a predicate that returns true', async () => {
    expect(await predicate(adapterMock, elementMocks[1], 1, elementMocks)).toBe(
      true
    );
  });

  it('should return a predicate that returns false', async () => {
    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );

    expect(await predicate(adapterMock, elementMocks[2], 2, elementMocks)).toBe(
      false
    );
  });
});

describe('attributeContains(name, value)', () => {
  beforeEach(() => {
    predicate = attributeContains('name', 'foo');
  });

  it('should return a predicate that returns true', async () => {
    getAttributeMock.mockImplementation(async => ' foobar ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      true
    );
  });

  it('should return a predicate that returns false', async () => {
    getAttributeMock.mockImplementation(async => ' bar ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );

    getAttributeMock.mockImplementation(async => null);

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );
  });

  it('should call getAttribute() and rethrow its error', async () => {
    getAttributeMock.mockImplementation(() => {
      throw new Error('message');
    });

    await expect(
      predicate(adapterMock, elementMocks[0], 0, elementMocks)
    ).rejects.toEqual(new Error('message'));

    expect(getAttributeMock.mock.calls).toEqual([['name']]);
  });
});

describe('attributeEquals(name, value)', () => {
  beforeEach(() => {
    predicate = attributeEquals('name', 'foo');
  });

  it('should return a predicate that returns true', async () => {
    getAttributeMock.mockImplementation(() => ' foo ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      true
    );
  });

  it('should return a predicate that returns false', async () => {
    getAttributeMock.mockImplementation(() => ' foobar ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );

    getAttributeMock.mockImplementation(() => null);

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );
  });

  it('should call getAttribute() and rethrow its error', async () => {
    getAttributeMock.mockImplementation(() => {
      throw new Error('message');
    });

    await expect(
      predicate(adapterMock, elementMocks[0], 0, elementMocks)
    ).rejects.toEqual(new Error('message'));

    expect(getAttributeMock.mock.calls).toEqual([['name']]);
  });
});

describe('attributeMatches(name, value)', () => {
  beforeEach(() => {
    predicate = attributeMatches('name', /^foo$/);
  });

  it('should return a predicate that returns true', async () => {
    getAttributeMock.mockImplementation(async => ' foo ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      true
    );
  });

  it('should return a predicate that returns false', async () => {
    getAttributeMock.mockImplementation(async => ' foobar ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );

    getAttributeMock.mockImplementation(async => null);

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );
  });

  it('should call getAttribute() and rethrow its error', async () => {
    getAttributeMock.mockImplementation(() => {
      throw new Error('message');
    });

    await expect(
      predicate(adapterMock, elementMocks[0], 0, elementMocks)
    ).rejects.toEqual(new Error('message'));

    expect(getAttributeMock.mock.calls).toEqual([['name']]);
  });
});

describe('htmlContains(html)', () => {
  beforeEach(() => {
    predicate = htmlContains('foo');
  });

  it('should return a predicate that returns true', async () => {
    getHtmlMock.mockImplementation(async => ' foobar ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      true
    );
  });

  it('should return a predicate that returns false', async () => {
    getHtmlMock.mockImplementation(async => ' bar ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );
  });

  it('should call getHtml() and rethrow its error', async () => {
    getHtmlMock.mockImplementation(() => {
      throw new Error('message');
    });

    await expect(
      predicate(adapterMock, elementMocks[0], 0, elementMocks)
    ).rejects.toEqual(new Error('message'));
  });
});

describe('htmlEquals(html)', () => {
  beforeEach(() => {
    predicate = htmlEquals('foo');
  });

  it('should return a predicate that returns true', async () => {
    getHtmlMock.mockImplementation(async => ' foo ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      true
    );
  });

  it('should return a predicate that returns false', async () => {
    getHtmlMock.mockImplementation(async => ' foobar ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );
  });

  it('should call getHtml() and rethrow its error', async () => {
    getHtmlMock.mockImplementation(() => {
      throw new Error('message');
    });

    await expect(
      predicate(adapterMock, elementMocks[0], 0, elementMocks)
    ).rejects.toEqual(new Error('message'));
  });
});

describe('htmlMatches(html)', () => {
  beforeEach(() => {
    predicate = htmlMatches(/^foo$/);
  });

  it('should return a predicate that returns true', async () => {
    getHtmlMock.mockImplementation(async => ' foo ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      true
    );
  });

  it('should return a predicate that returns false', async () => {
    getHtmlMock.mockImplementation(async => ' foobar ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );
  });

  it('should call getHtml() and rethrow its error', async () => {
    getHtmlMock.mockImplementation(() => {
      throw new Error('message');
    });

    await expect(
      predicate(adapterMock, elementMocks[0], 0, elementMocks)
    ).rejects.toEqual(new Error('message'));
  });
});

describe('textContains(text)', () => {
  beforeEach(() => {
    predicate = textContains('foo');
  });

  it('should return a predicate that returns true', async () => {
    getTextMock.mockImplementation(async => ' foobar ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      true
    );
  });

  it('should return a predicate that returns false', async () => {
    getTextMock.mockImplementation(async => ' bar ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );
  });

  it('should call getText() and rethrow its error', async () => {
    getTextMock.mockImplementation(() => {
      throw new Error('message');
    });

    await expect(
      predicate(adapterMock, elementMocks[0], 0, elementMocks)
    ).rejects.toEqual(new Error('message'));
  });
});

describe('textEquals(text)', () => {
  beforeEach(() => {
    predicate = textEquals('foo');
  });

  it('should return a predicate that returns true', async () => {
    getTextMock.mockImplementation(async => ' foo ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      true
    );
  });

  it('should return a predicate that returns false', async () => {
    getTextMock.mockImplementation(async => ' foobar ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );
  });

  it('should call getText() and rethrow its error', async () => {
    getTextMock.mockImplementation(() => {
      throw new Error('message');
    });

    await expect(
      predicate(adapterMock, elementMocks[0], 0, elementMocks)
    ).rejects.toEqual(new Error('message'));
  });
});

describe('textMatches(text)', () => {
  beforeEach(() => {
    predicate = textMatches(/^foo$/);
  });

  it('should return a predicate that returns true', async () => {
    getTextMock.mockImplementation(async => ' foo ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      true
    );
  });

  it('should return a predicate that returns false', async () => {
    getTextMock.mockImplementation(async => ' foobar ');

    expect(await predicate(adapterMock, elementMocks[0], 0, elementMocks)).toBe(
      false
    );
  });

  it('should call getText() and rethrow its error', async () => {
    getTextMock.mockImplementation(() => {
      throw new Error('message');
    });

    await expect(
      predicate(adapterMock, elementMocks[0], 0, elementMocks)
    ).rejects.toEqual(new Error('message'));
  });
});
