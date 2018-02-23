import {Condition, Operator, TestStep} from '@pageobject/reliable';
import {Page, PageObject} from '@pageobject/stable';

export type Script<TElement extends Element, TResult> = (
  element: TElement,
  ...args: any[] /* tslint:disable-line no-any */
) => TResult;

export interface FlexibleElement {
  click(): Promise<void>;
  doubleClick(): Promise<void>;

  execute<TElement extends Element, TResult>(
    script: Script<TElement, TResult>,
    ...args: any[] /* tslint:disable-line no-any */
  ): Promise<TResult>;

  sendCharacter(character: string): Promise<void>;
  sendKey(key: FlexibleKey): Promise<void>;
}

export enum FlexibleKey {
  TAB = 9,
  ENTER = 13,
  ESCAPE = 27
}

export type FlexiblePage = Page<FlexibleElement>;

export abstract class FlexiblePageObject extends PageObject<FlexibleElement> {
  public click(): TestStep {
    return async () => (await this.findElement()).click();
  }

  public doubleClick(): TestStep {
    return async () => (await this.findElement()).doubleClick();
  }

  public sendKey(key: FlexibleKey): TestStep {
    return async () => (await this.findElement()).sendKey(key);
  }

  public blur(): TestStep {
    return async () =>
      (await this.findElement()).execute((_element: HTMLElement) =>
        _element.blur()
      );
  }

  public focus(): TestStep {
    return async () =>
      (await this.findElement()).execute((_element: HTMLElement) =>
        _element.focus()
      );
  }

  public scrollIntoView(): TestStep {
    return async () =>
      (await this.findElement()).execute(_element => {
        const {height, left, top, width} = _element.getBoundingClientRect();
        const {innerHeight, innerWidth} = window;

        window.scrollBy(
          left - innerWidth / 2 + width / 2,
          top - innerHeight / 2 + height / 2
        );
      });
  }

  public type(text: string): TestStep {
    return async () => {
      const characters = text.split('');

      for (let i = 0; i < characters.length; i += 1) {
        await (await this.findElement()).sendCharacter(characters[i]);

        if (i < characters.length - 1) {
          await new Promise<void>(resolve => setTimeout(resolve, 100));
        }
      }
    };
  }

  public getAttribute(
    name: string,
    operator: Operator<string>
  ): Condition<string> {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute(
          (_element, _name) => (_element.getAttribute(_name) || '').trim(),
          name
        ),
      `attribute.${name}`
    );
  }

  public getHTML(operator: Operator<string>): Condition<string> {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute(_element =>
          _element.outerHTML.trim()
        ),
      'html'
    );
  }

  public getPageTitle(operator: Operator<string>): Condition<string> {
    return new Condition(
      operator,
      async () => (await this.findElement()).execute(() => document.title),
      'pageTitle'
    );
  }

  public getPageURL(operator: Operator<string>): Condition<string> {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute(() => window.location.href),
      'pageURL'
    );
  }

  public getProperty(
    name: string,
    operator: Operator<string>
  ): Condition<string> {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute((_element, _name) => {
          /* tslint:disable-next-line no-any */
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

          throw new Error(
            `Unable to access the non-primitive property <${name}>`
          );
        }, name),
      `property.${name}`
    );
  }

  public getComputedStyle(
    name: string,
    operator: Operator<string>
  ): Condition<string> {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute(
          (_element, _name) =>
            window
              .getComputedStyle(_element)
              .getPropertyValue(_name)
              .trim(),
          name
        ),
      `computedStyle.${name}`
    );
  }

  public getRenderedText(operator: Operator<string>): Condition<string> {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute((_element: HTMLElement) =>
          _element.innerText.trim()
        ),
      'renderedText'
    );
  }

  public isInView(operator: Operator<boolean>): Condition<boolean> {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute(_element => {
          const {bottom, left, right, top} = _element.getBoundingClientRect();
          const {innerHeight, innerWidth} = window;

          return (
            top >= 0 &&
            left >= 0 &&
            bottom <= innerHeight &&
            right <= innerWidth
          );
        }),
      'inView'
    );
  }

  public isVisible(operator: Operator<boolean>): Condition<boolean> {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute((_element: HTMLElement) => {
          const {offsetHeight, offsetWidth} = _element;

          return Boolean(offsetHeight || offsetWidth);
        }),
      'visible'
    );
  }
}
