import {Adapter} from './PageObject';

export class AdapterMock<TElement> implements Adapter<TElement> {
  public readonly click: jest.Mock<Promise<void>> = jest.fn();
  /* tslint:disable-next-line no-any */
  public readonly evaluate: jest.Mock<Promise<any>> = jest.fn();
  public readonly findElements: jest.Mock<Promise<TElement[]>> = jest.fn();
  public readonly isVisible: jest.Mock<Promise<boolean>> = jest.fn();
  public readonly takeScreenshot: jest.Mock<Promise<string>> = jest.fn();
  public readonly type: jest.Mock<Promise<void>> = jest.fn();
}
