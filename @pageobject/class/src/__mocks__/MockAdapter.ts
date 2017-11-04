export class MockAdapter<TElement = string> {
  public readonly findElements: jest.Mock<Promise<TElement[]>>;
  public readonly getCurrentUrl: jest.Mock<Promise<string>>;

  public constructor() {
    this.findElements = jest.fn(async () => []);
    this.getCurrentUrl = jest.fn(async () => 'mockUrl');
  }
}
