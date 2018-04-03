import {serialize} from '@pageobject/main';
import {FromFileOptions, JSDOM} from 'jsdom';
import {Script} from 'vm';
import {Argument, Key, WebDriver, WebElement} from '.';

class JSDOMWebElement implements WebElement {
  public readonly adaptee: HTMLElement;
  public readonly driver: JSDOM;

  public constructor(adaptee: HTMLElement, driver: JSDOM) {
    this.adaptee = adaptee;
    this.driver = driver;

    // https://github.com/jsdom/jsdom/issues/1245
    // istanbul ignore next
    this.adaptee.innerText =
      this.adaptee.innerText || this.adaptee.textContent || '';
  }

  public async click(): Promise<void> {
    this.adaptee.dispatchEvent(
      new this.driver.window.MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
  }

  public async doubleClick(): Promise<void> {
    this.adaptee.dispatchEvent(
      new this.driver.window.MouseEvent('dblclick', {
        bubbles: true,
        cancelable: true
      })
    );
  }

  public async execute<THTMLElement extends HTMLElement, TResult>(
    script: (element: THTMLElement, ...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    // tslint:disable-next-line
    (this.driver.window as any).__element__ = this.adaptee;

    const code = `(${script.toString()})(${[
      'window.__element__',
      ...args.map(serialize)
    ].join(', ')})`;

    // tslint:disable-next-line
    return this.driver.runVMScript(new Script(code)) as any;
  }
}

export class JSDOMWebDriver implements WebDriver {
  private _jsdom = new JSDOM();

  public async execute<TResult>(
    script: (...args: Argument[]) => TResult,
    ...args: Argument[]
  ): Promise<TResult> {
    const code = `(${script.toString()})(${args.map(serialize).join(', ')})`;

    // tslint:disable-next-line
    return this._jsdom.runVMScript(new Script(code)) as any;
  }

  public async findElements(
    selector: string,
    parent?: WebElement
  ): Promise<WebElement[]> {
    return Array.from(
      (
        (parent && (parent as JSDOMWebElement).adaptee) ||
        this._jsdom.window.document
      ).querySelectorAll(selector)
    ).map(element => new JSDOMWebElement(element as HTMLElement, this._jsdom));
  }

  public async navigateTo(url: string): Promise<void> {
    await this.quit();

    const options: FromFileOptions = {runScripts: 'dangerously'};

    this._jsdom = /file:\/\//.test(url)
      ? await JSDOM.fromFile(url.slice(7), options)
      : await JSDOM.fromURL(url, options);
  }

  public async press(key: Key): Promise<void> {
    const options = {bubbles: true, cancelable: true, key};

    this._jsdom.window.document.dispatchEvent(
      new this._jsdom.window.KeyboardEvent('keydown', options)
    );

    if (key.length === 1 || key === 'Enter') {
      this._jsdom.window.document.dispatchEvent(
        new this._jsdom.window.KeyboardEvent('keypress', options)
      );
    }

    this._jsdom.window.document.dispatchEvent(
      new this._jsdom.window.KeyboardEvent('keyup', options)
    );
  }

  public async quit(): Promise<void> {
    this._jsdom.window.close();
  }
}
