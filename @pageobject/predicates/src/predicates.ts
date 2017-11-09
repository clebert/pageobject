import {Adapter, Predicate} from '@pageobject/class';

async function getAttribute<TElement, TAdapter extends Adapter<TElement>>(
  adapter: TAdapter,
  element: TElement,
  name: string
): Promise<string> {
  const value = await adapter.evaluate(
    (_element: HTMLElement, _name: string) => _element.getAttribute(_name),
    element,
    name
  );

  return value ? value.trim() : '';
}

async function getHtml<TElement, TAdapter extends Adapter<TElement>>(
  adapter: TAdapter,
  element: TElement
): Promise<string> {
  return adapter.evaluate(
    (_element: HTMLElement) => _element.innerHTML.trim(),
    element
  );
}

async function getText<TElement, TAdapter extends Adapter<TElement>>(
  adapter: TAdapter,
  element: TElement
): Promise<string> {
  return adapter.evaluate(
    (_element: HTMLElement) => _element.innerText.trim(),
    element
  );
}

export function not<TElement, TAdapter extends Adapter<TElement>>(
  predicate: Predicate<TElement, TAdapter>
): Predicate<TElement, TAdapter> {
  return async (adapter, element, index, elements) =>
    !await predicate(adapter, element, index, elements);
}

export function and<TElement, TAdapter extends Adapter<TElement>>(
  predicateA: Predicate<TElement, TAdapter>,
  predicateB: Predicate<TElement, TAdapter>
): Predicate<TElement, TAdapter> {
  return async (adapter, element, index, elements) =>
    (await predicateA(adapter, element, index, elements)) &&
    /* tslint:disable-next-line no-return-await */
    (await predicateB(adapter, element, index, elements));
}

export function or<TElement, TAdapter extends Adapter<TElement>>(
  predicateA: Predicate<TElement, TAdapter>,
  predicateB: Predicate<TElement, TAdapter>
): Predicate<TElement, TAdapter> {
  return async (adapter, element, index, elements) =>
    (await predicateA(adapter, element, index, elements)) ||
    /* tslint:disable-next-line no-return-await */
    (await predicateB(adapter, element, index, elements));
}

export function xor<TElement, TAdapter extends Adapter<TElement>>(
  predicateA: Predicate<TElement, TAdapter>,
  predicateB: Predicate<TElement, TAdapter>
): Predicate<TElement, TAdapter> {
  return async (adapter, element, index, elements) =>
    (await predicateA(adapter, element, index, elements))
      ? !await predicateB(adapter, element, index, elements)
      : /* tslint:disable-next-line no-return-await */
        await predicateB(adapter, element, index, elements);
}

export function atIndex<TElement, TAdapter extends Adapter<TElement>>(
  n: number
): Predicate<TElement, TAdapter> {
  return async (adapter, element, index) => index === n;
}

export function attributeContains<TElement, TAdapter extends Adapter<TElement>>(
  name: string,
  value: string
): Predicate<TElement, TAdapter> {
  return async (adapter, element) =>
    (await getAttribute(adapter, element, name)).indexOf(value) > -1;
}

export function attributeEquals<TElement, TAdapter extends Adapter<TElement>>(
  name: string,
  value: string
): Predicate<TElement, TAdapter> {
  return async (adapter, element) =>
    (await getAttribute(adapter, element, name)).trim() === value;
}

export function attributeMatches<TElement, TAdapter extends Adapter<TElement>>(
  name: string,
  value: RegExp
): Predicate<TElement, TAdapter> {
  return async (adapter, element) =>
    value.test((await getAttribute(adapter, element, name)).trim());
}

export function htmlContains<TElement, TAdapter extends Adapter<TElement>>(
  html: string
): Predicate<TElement, TAdapter> {
  return async (adapter, element) =>
    (await getHtml(adapter, element)).indexOf(html) > -1;
}

export function htmlEquals<TElement, TAdapter extends Adapter<TElement>>(
  html: string
): Predicate<TElement, TAdapter> {
  return async (adapter, element) =>
    (await getHtml(adapter, element)).trim() === html;
}

export function htmlMatches<TElement, TAdapter extends Adapter<TElement>>(
  html: RegExp
): Predicate<TElement, TAdapter> {
  return async (adapter, element) =>
    html.test((await getHtml(adapter, element)).trim());
}

export function textContains<TElement, TAdapter extends Adapter<TElement>>(
  text: string
): Predicate<TElement, TAdapter> {
  return async (adapter, element) =>
    (await getText(adapter, element)).indexOf(text) > -1;
}

export function textEquals<TElement, TAdapter extends Adapter<TElement>>(
  text: string
): Predicate<TElement, TAdapter> {
  return async (adapter, element) =>
    (await getText(adapter, element)).trim() === text;
}

export function textMatches<TElement, TAdapter extends Adapter<TElement>>(
  text: RegExp
): Predicate<TElement, TAdapter> {
  return async (adapter, element) =>
    text.test((await getText(adapter, element)).trim());
}
