/* tslint:disable no-any */

import {PageObject, Predicate} from '..';
import {MockAdapter} from '../__mocks__/MockAdapter';

export class MockPageObject<TElement = string> extends PageObject<
  TElement,
  MockAdapter<TElement>
> {
  public getAdapter(): MockAdapter<TElement> {
    return this.adapter;
  }

  public async callFindSelf(): Promise<TElement> {
    return this.findSelf();
  }

  public async callFindFirstDescendant(
    selector: string,
    predicate: Predicate<TElement>
  ): Promise<TElement> {
    return this.findFirstDescendant(selector, predicate);
  }

  public async callFindUniqueDescendant(
    selector: string,
    predicate: Predicate<TElement>
  ): Promise<TElement> {
    return this.findUniqueDescendant(selector, predicate);
  }

  public callSelectFirstDescendant(
    Component: jest.Mock<PageObject<TElement, MockAdapter<TElement>>>,
    predicate: Predicate<TElement>
  ): PageObject<TElement, MockAdapter<TElement>> {
    return this.selectFirstDescendant(Component as any, predicate);
  }

  public callSelectUniqueDescendant(
    Component: jest.Mock<PageObject<TElement, MockAdapter<TElement>>>,
    predicate: Predicate<TElement>
  ): PageObject<TElement, MockAdapter<TElement>> {
    return this.selectUniqueDescendant(Component as any, predicate);
  }

  public async callGoto(
    Page: jest.Mock<PageObject<TElement, MockAdapter<TElement>>>
  ): Promise<PageObject<TElement, MockAdapter<TElement>>> {
    return this.goto(Page as any);
  }
}
