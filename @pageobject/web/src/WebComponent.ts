import {Component, Effect} from '@pageobject/base';

export type Argument = any; // tslint:disable-line no-any

export interface WebNode {
  click(): Promise<void>;
  doubleClick(): Promise<void>;

  execute<THTMLElement extends HTMLElement, TResult>(
    script: (element: THTMLElement, ...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult>;
}

export class WebComponent extends Component<WebNode> {
  public click(): Effect<void> {
    return async () => (await this.findUniqueNode()).click();
  }

  public doubleClick(): Effect<void> {
    return async () => (await this.findUniqueNode()).doubleClick();
  }

  /**
   * @returns The "rendered" text content of this component and its descendants.
   */
  public getText(): Effect<string> {
    return async () =>
      (await this.findUniqueNode()).execute(element =>
        element.innerText.trim()
      );
  }

  public hasFocus(): Effect<boolean> {
    return async () =>
      (await this.findUniqueNode()).execute(
        element => document.activeElement === element
      );
  }

  /**
   * A component is considered visible if it consumes space in the document.
   */
  public isVisible(): Effect<boolean> {
    return async () =>
      (await this.findUniqueNode()).execute(element => {
        const {offsetHeight, offsetWidth} = element;

        return Boolean(offsetHeight || offsetWidth);
      });
  }

  public scrollIntoView(): Effect<void> {
    return async () =>
      (await this.findUniqueNode()).execute(element => {
        const {height, left, top, width} = element.getBoundingClientRect();
        const {innerHeight, innerWidth} = window;

        window.scrollBy(
          left - innerWidth / 2 + width / 2,
          top - innerHeight / 2 + height / 2
        );
      });
  }
}
