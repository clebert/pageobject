/* tslint:disable no-any */

import {
  AbstractPageObject,
  Page,
  PageObjectConstructor,
  Predicate
} from '@pageobject/core';

export type StandardAction<TElement extends Element, TResult> = (
  element: TElement,
  ...args: any[]
) => TResult;

export interface StandardElement {
  click(): Promise<void>;

  perform<TElement extends Element, TResult>(
    action: StandardAction<TElement, TResult>,
    ...args: any[]
  ): Promise<TResult>;

  type(text: string): Promise<void>;
}

export type StandardPage = Page<StandardElement>;

export type StandardPageObjectConstructor<
  TPageObject extends StandardPageObject
> = PageObjectConstructor<StandardElement, TPageObject>;

export type StandardPredicate<
  TPageObject extends StandardPageObject
> = Predicate<StandardElement, TPageObject>;

/**
 * ```js
 * // ES2015 modules
 * import {StandardPageObject} from '@pageobject/standard';
 *
 * // CommonJS
 * const {StandardPageObject} = require('@pageobject/standard');
 * ```
 */
export abstract class StandardPageObject extends AbstractPageObject<
  StandardElement
> implements StandardElement {
  public async click(): Promise<void> {
    return (await this.getElement()).click();
  }

  public async perform<TElement extends Element, TResult>(
    action: StandardAction<TElement, TResult>,
    ...args: any[]
  ): Promise<TResult> {
    return (await this.getElement()).perform(action, ...args);
  }

  /**
   * This method sends the specified text as individual characters to the
   * unique DOM element assigned to this page object.
   *
   * Between the sending of the individual characters, 100 milliseconds are
   * paused in each case, so that this method emulates the typing speed of a
   * human user.
   */
  public async type(text: string): Promise<void> {
    return (await this.getElement()).type(text);
  }

  public async focus(): Promise<void> {
    return this.perform((_element: HTMLElement) => _element.focus());
  }

  public async scrollIntoView(alignToTop: boolean = true): Promise<void> {
    return this.perform(
      (_element, _alignToTop) => _element.scrollIntoView(_alignToTop),
      alignToTop
    );
  }

  /**
   * @returns A promise that will be resolved with the trimmed value of the
   * specified attribute of the unique DOM element assigned to this page object:
   *
   * - If the value of the specified attribute is `null`, it is replaced with an
   * empty string.
   */
  public async getAttribute(name: string): Promise<string> {
    return this.perform(
      (_element, _name) => (_element.getAttribute(_name) || '').trim(),
      name
    );
  }

  /**
   * @returns A promise that will be resolved with the trimmed value of the
   * `outerHTML` property of the unique DOM element assigned to this page
   * object.
   */
  public async getHTML(): Promise<string> {
    return this.getProperty('outerHTML');
  }

  /**
   * @returns A promise that will be resolved with the value of
   * `document.title`.
   */
  public async getPageTitle(): Promise<string> {
    return this.perform(() => document.title);
  }

  /**
   * @returns A promise that will be resolved with the value of
   * `window.location.href`.
   */
  public async getPageURL(): Promise<string> {
    return this.perform(() => window.location.href);
  }

  /**
   * @returns A promise that will be resolved with the trimmed value of the
   * specified property of the unique DOM element assigned to this page
   * object:
   *
   * - The returned promise will be rejected if the value of the specified
   * property is not a primitive.
   *
   * - If the value of the specified property is `null` or `undefined`, it is
   * replaced with an empty string.
   *
   * - If the value of the specified property is of type `boolean` or `number`,
   * it is converted to a string.
   */
  public async getProperty(name: string): Promise<string> {
    return this.perform((_element, _name) => {
      const value = (_element as any)[_name];

      if (value === null || value === undefined) {
        return '';
      }

      switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'string': {
          return String(value).trim();
        }
      }

      throw new Error(`Unable to get non-primitive property (${name})`);
    }, name);
  }

  /**
   * This method uses the `window.getComputedStyle()` web API.
   *
   * @returns A promise that will be resolved with the trimmed value of the
   * specified style property of the unique DOM element assigned to this page
   * object.
   */
  public async getStyle(name: string): Promise<string> {
    return this.perform(
      (_element, _name) =>
        window
          .getComputedStyle(_element)
          .getPropertyValue(_name)
          .trim(),
      name
    );
  }

  /**
   * @returns A promise that will be resolved with the trimmed value of the
   * `innerText` property of the unique DOM element assigned to this page
   * object.
   */
  public async getText(): Promise<string> {
    return this.getProperty('innerText');
  }

  /**
   * The unique DOM element assigned to this page object is considered visible
   * as long as it does not have the style properties `display: none` or
   * `visibility: hidden`.
   *
   * This method uses the `window.getComputedStyle()` web API.
   */
  public async isVisible(): Promise<boolean> {
    return (
      (await this.getStyle('display')) !== 'none' &&
      (await this.getStyle('visibility')) !== 'hidden'
    );
  }
}
