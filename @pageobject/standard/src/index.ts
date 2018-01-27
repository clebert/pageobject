/* tslint:disable no-any */

import {AbstractPageObject, Finder} from '@pageobject/core';

export type StandardElementAction<TElement extends Element, TResult> = (
  self: TElement,
  ...args: any[]
) => TResult;

export interface StandardElement {
  click(): Promise<void>;

  perform<TElement extends Element, TResult>(
    action: StandardElementAction<TElement, TResult>,
    ...args: any[]
  ): Promise<TResult>;

  type(text: string): Promise<void>;
  isVisible(): Promise<boolean>;
}

export type StandardFinder = Finder<StandardElement>;

/**
 * `import {StandardPageObject} from '@pageobject/standard';`
 *
 * @abstract
 */
export abstract class StandardPageObject extends AbstractPageObject<
  StandardElement
> implements StandardElement {
  public async click(): Promise<void> {
    return (await this.getElement()).click();
  }

  public async perform<TElement extends Element, TResult>(
    action: StandardElementAction<TElement, TResult>,
    ...args: any[]
  ): Promise<TResult> {
    return (await this.getElement()).perform(action, ...args);
  }

  public async type(text: string): Promise<void> {
    return (await this.getElement()).type(text);
  }

  public async isVisible(): Promise<boolean> {
    return (await this.getElement()).isVisible();
  }
}
