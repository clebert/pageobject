import {Component, Effect} from '@pageobject/base';

export type Argument = any; // tslint:disable-line no-any

export interface WebElement {
  click(): Promise<void>;
  doubleClick(): Promise<void>;

  execute<THTMLElement extends HTMLElement, TResult>(
    script: (element: THTMLElement, ...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult>;
}

export class WebComponent extends Component<WebElement> {
  public click(): Effect<void> {
    const trigger = async () => (await this.findElement()).click();

    return {context: this, description: 'click()', trigger};
  }

  public doubleClick(): Effect<void> {
    const trigger = async () => (await this.findElement()).doubleClick();

    return {context: this, description: 'doubleClick()', trigger};
  }

  /**
   * @returns The "rendered" text content of this web component and its descendants.
   */
  public getText(): Effect<string> {
    const trigger = async () =>
      (await this.findElement()).execute(element => element.innerText);

    return {context: this, description: 'getText()', trigger};
  }

  public hasFocus(): Effect<boolean> {
    const trigger = async () =>
      (await this.findElement()).execute(
        element => document.activeElement === element
      );

    return {context: this, description: 'hasFocus()', trigger};
  }

  /**
   * This web component is considered visible if it consumes space in the document.
   */
  public isVisible(): Effect<boolean> {
    const trigger = async () =>
      (await this.findElement()).execute(element => {
        const {offsetHeight, offsetWidth} = element;

        return Boolean(offsetHeight || offsetWidth);
      });

    return {context: this, description: 'isVisible()', trigger};
  }

  public scrollIntoView(): Effect<void> {
    const trigger = async () =>
      (await this.findElement()).execute(element => {
        const {height, left, top, width} = element.getBoundingClientRect();
        const {innerHeight, innerWidth} = window;

        window.scrollBy(
          left - innerWidth / 2 + width / 2,
          top - innerHeight / 2 + height / 2
        );
      });

    return {context: this, description: 'scrollIntoView()', trigger};
  }
}
