import {serialize} from '@pageobject/base';
import {FromFileOptions, JSDOM} from 'jsdom';
import {Script} from 'vm';
import {Argument, Key, WebAdapter, WebElement} from '.';

class JSDOMElement implements WebElement {
  public readonly adaptee: HTMLElement;
  public readonly jsdom: JSDOM;

  public constructor(adaptee: HTMLElement, jsdom: JSDOM) {
    this.adaptee = adaptee;
    this.jsdom = jsdom;

    // https://github.com/jsdom/jsdom/issues/1245
    // istanbul ignore next
    this.adaptee.innerText =
      this.adaptee.innerText || this.adaptee.textContent || '';
  }

  public async click(): Promise<void> {
    this.adaptee.dispatchEvent(
      new this.jsdom.window.MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
    );
  }

  public async doubleClick(): Promise<void> {
    this.adaptee.dispatchEvent(
      new this.jsdom.window.MouseEvent('dblclick', {
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
    (this.jsdom.window as any).__element__ = this.adaptee;

    const code = `(${script.toString()})(${[
      'window.__element__',
      ...args.map(serialize)
    ].join(', ')})`;

    // tslint:disable-next-line
    return this.jsdom.runVMScript(new Script(code)) as any;
  }
}

export class JSDOMAdapter implements WebAdapter {
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
        (parent && (parent as JSDOMElement).adaptee) ||
        this._jsdom.window.document
      ).querySelectorAll(selector)
    ).map(element => new JSDOMElement(element as HTMLElement, this._jsdom));
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