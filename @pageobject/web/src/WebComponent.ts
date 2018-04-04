import {Component, FunctionCall} from '@pageobject/base';

export type Argument = any; // tslint:disable-line no-any

export interface WebElement {
  click(): Promise<void>;
  doubleClick(): Promise<void>;

  execute<THTMLElement extends HTMLElement, TResult>(
    script: (element: THTMLElement, ...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult>;
}

export abstract class WebComponent extends Component<WebElement> {
  public click(): FunctionCall<void> {
    return new FunctionCall(this, this.click.name, arguments, async () =>
      (await this.findElement()).click()
    );
  }

  public doubleClick(): FunctionCall<void> {
    return new FunctionCall(this, this.doubleClick.name, arguments, async () =>
      (await this.findElement()).doubleClick()
    );
  }

  /**
   * @returns The "rendered" text content of this web component and its descendants.
   */
  public getText(): FunctionCall<string> {
    return new FunctionCall(this, this.getText.name, arguments, async () =>
      (await this.findElement()).execute(element => element.innerText)
    );
  }

  public hasFocus(): FunctionCall<boolean> {
    return new FunctionCall(this, this.hasFocus.name, arguments, async () =>
      (await this.findElement()).execute(
        element => document.activeElement === element
      )
    );
  }

  /**
   * This web component is considered visible if it consumes space in the document.
   */
  public isVisible(): FunctionCall<boolean> {
    return new FunctionCall(this, this.isVisible.name, arguments, async () =>
      (await this.findElement()).execute(element => {
        const {offsetHeight, offsetWidth} = element;

        return Boolean(offsetHeight || offsetWidth);
      })
    );
  }

  public scrollIntoView(): FunctionCall<void> {
    return new FunctionCall(
      this,
      this.scrollIntoView.name,
      arguments,
      async () =>
        (await this.findElement()).execute(element => {
          const {height, left, top, width} = element.getBoundingClientRect();
          const {innerHeight, innerWidth} = window;

          window.scrollBy(
            left - innerWidth / 2 + width / 2,
            top - innerHeight / 2 + height / 2
          );
        })
    );
  }
}
