import {Adapter} from '.';

export class AdapterMock<TElement> implements Adapter<TElement> {
  /* tslint:disable-next-line no-any */
  public readonly evaluate: jest.Mock<Promise<any>> = jest.fn();
  public readonly findElements: jest.Mock<Promise<TElement[]>> = jest.fn();
}
