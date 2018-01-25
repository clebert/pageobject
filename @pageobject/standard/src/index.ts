import {AbstractPageObject, Finder} from '@pageobject/core';

export interface StandardElement {
  click(): Promise<void>;
  type(text: string): Promise<void>;
  getAttribute(name: string): Promise<string | undefined>;
  getHTML(): Promise<string>;
  getProperty<TValue>(name: string): Promise<TValue | undefined>;
  getTagName(): Promise<string>;
  getText(): Promise<string>;
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

  public async type(text: string): Promise<void> {
    return (await this.getElement()).type(text);
  }

  public async getAttribute(name: string): Promise<string | undefined> {
    return (await this.getElement()).getAttribute(name);
  }

  public async getHTML(): Promise<string> {
    return (await this.getElement()).getHTML();
  }

  public async getProperty<TValue>(name: string): Promise<TValue | undefined> {
    return (await this.getElement()).getProperty<TValue>(name);
  }

  public async getTagName(): Promise<string> {
    return (await this.getElement()).getTagName();
  }

  public async getText(): Promise<string> {
    return (await this.getElement()).getText();
  }

  public async isVisible(): Promise<boolean> {
    return (await this.getElement()).isVisible();
  }
}
