import {Predicate} from '@pageobject/class';
import {ElementHandle} from 'puppeteer';
import {PuppeteerAdapter} from './PuppeteerAdapter';

export function atIndex(n: number): Predicate<ElementHandle, PuppeteerAdapter> {
  return async (adapter, element, index) => index === n;
}

export function textEquals(
  value: string
): Predicate<ElementHandle, PuppeteerAdapter> {
  return async (adapter, element) => {
    const innerTextHandle = await adapter.page.evaluateHandle(
      /* istanbul ignore next */
      (_element: HTMLElement) => _element.innerText.trim(),
      element
    );

    const innerText = await innerTextHandle.jsonValue();

    await innerTextHandle.dispose();

    return innerText === value;
  };
}
