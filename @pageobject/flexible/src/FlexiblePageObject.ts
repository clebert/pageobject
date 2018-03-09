import {Action, Condition, Operator, equals} from '@pageobject/reliable';
import {Adapter, PageObject, PageObjectClass} from '@pageobject/stable';
import {inspect} from 'util';

export type Script<TElement extends Element, TResult> = (
  element: TElement,
  ...args: any[] /* tslint:disable-line no-any */
) => TResult;

export enum FlexibleKey {
  TAB = 9,
  ENTER = 13,
  ESCAPE = 27
}

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

export interface FlexibleAdapter extends Adapter<FlexibleElement> {
  navigateTo(url: string): Promise<void>;
}

export type FlexiblePageObjectClass<
  TPageObject extends FlexiblePageObject
> = PageObjectClass<FlexibleElement, FlexibleAdapter, TPageObject>;

/* tslint:disable-next-line no-any */
function serialize(value: any): string {
  return inspect(value, false, null);
}

function lookup(key: FlexibleKey): string {
  switch (key) {
    case FlexibleKey.ENTER:
      return 'ENTER';
    case FlexibleKey.ESCAPE:
      return 'ESCAPE';
    case FlexibleKey.TAB:
      return 'TAB';
  }
}

export abstract class FlexiblePageObject extends PageObject<
  FlexibleElement,
  FlexibleAdapter
> {
  public click(): Action {
    return {
      description: 'Click',
      perform: async () => (await this.findElement()).click()
    };
  }

  public doubleClick(): Action {
    return {
      description: 'Double-click',
      perform: async () => (await this.findElement()).doubleClick()
    };
  }

  public navigateTo(url: string): Action {
    return {
      description: `Navigate to ${serialize(url)}`,
      perform: async () => this.adapter.navigateTo(url)
    };
  }

  public type(text: string): Action {
    return {
      description: `Type ${serialize(text)}`,
      perform: async () => {
        const characters = text.split('');

        for (let i = 0; i < characters.length; i += 1) {
          await (await this.findElement()).sendCharacter(characters[i]);

          if (i < characters.length - 1) {
            await new Promise<void>(resolve => setTimeout(resolve, 100));
          }
        }
      }
    };
  }

  public sendKey(key: FlexibleKey): Action {
    return {
      description: `Send key ${lookup(key)}`,
      perform: async () => (await this.findElement()).sendKey(key)
    };
  }

  public blur(): Action {
    return {
      description: 'Blur',
      perform: async () =>
        (await this.findElement()).execute((_element: HTMLElement) =>
          _element.blur()
        )
    };
  }

  public focus(): Action {
    return {
      description: 'Focus',
      perform: async () =>
        (await this.findElement()).execute((_element: HTMLElement) =>
          _element.focus()
        )
    };
  }

  public scrollIntoView(): Action {
    return {
      description: 'Scroll into view',
      perform: async () =>
        (await this.findElement()).execute(_element => {
          const {height, left, top, width} = _element.getBoundingClientRect();
          const {innerHeight, innerWidth} = window;

          window.scrollBy(
            left - innerWidth / 2 + width / 2,
            top - innerHeight / 2 + height / 2
          );
        })
    };
  }

  public getAttribute(name: string, operator: Operator<string>): Condition {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute(
          (_element, _name) => (_element.getAttribute(_name) || '').trim(),
          name
        ),
      `attribute: ${name}`
    );
  }

  public getHTML(operator: Operator<string>): Condition {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute(_element =>
          _element.outerHTML.trim()
        ),
      'html'
    );
  }

  public getPageTitle(operator: Operator<string>): Condition {
    return new Condition(
      operator,
      async () => (await this.findElement()).execute(() => document.title),
      'pageTitle'
    );
  }

  public getPageURL(operator: Operator<string>): Condition {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute(() => window.location.href),
      'pageURL'
    );
  }

  /* tslint:disable-next-line no-any */
  public getProperty(name: string, operator: Operator<any>): Condition {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute((_element, _name) => {
          /* tslint:disable-next-line no-any */
          const value = (_element as any)[_name];

          if (typeof value === 'function') {
            throw new Error(`Unable to access function property: ${name}`);
          }

          return value;
        }, name),
      `property: ${name}`
    );
  }

  public getComputedStyle(name: string, operator: Operator<string>): Condition {
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
      `computedStyle: ${name}`
    );
  }

  public getRenderedText(operator: Operator<string>): Condition {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute((_element: HTMLElement) =>
          _element.innerText.trim()
        ),
      'renderedText'
    );
  }

  public hasFocus(operator: Operator<boolean> = equals(true)): Condition {
    return new Condition(
      operator,
      async () =>
        (await this.findElement()).execute(
          _element => document.activeElement === _element
        ),
      'focus'
    );
  }

  /**
   * This page object is considered visible if the corresponding DOM element consumes space in the document.
   */
  public isVisible(operator: Operator<boolean> = equals(true)): Condition {
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
