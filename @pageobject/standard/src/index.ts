/* tslint:disable no-any */

import {AbstractPageObject, Finder, Predicate} from '@pageobject/core';

export type StandardElementAction<TElement extends Element, TResult> = (
  element: TElement,
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

export type StandardPredicate<
  TPageObject extends StandardPageObject
> = Predicate<StandardElement, TPageObject>;

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

  public async getAttribute(name: string): Promise<string | null> {
    return this.perform((_element, _name) => {
      const value = _element.getAttribute(_name);

      return value === null ? value : value.trim();
    }, name);
  }

  public async getBooleanProperty(name: string): Promise<boolean | null> {
    return this.perform((_element, _name: keyof Element) => {
      const value = _element[_name];

      /* tslint:disable-next-line strict-type-predicates */
      return typeof value === 'boolean' ? value : null;
    }, name);
  }

  public async getNumberProperty(name: string): Promise<number | null> {
    return this.perform((_element, _name: keyof Element) => {
      const value = _element[_name];

      return typeof value === 'number' ? value : null;
    }, name);
  }

  public async getStringProperty(name: string): Promise<string | null> {
    return this.perform((_element, _name: keyof Element) => {
      const value = _element[_name];

      return typeof value === 'string' ? value : null;
    }, name);
  }
}
