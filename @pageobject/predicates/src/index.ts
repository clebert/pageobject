import {PageObject, Predicate} from '@pageobject/class';

/**
 * `import {Selector} from '@pageobject/predicates';`
 */
export type Selector<TComponent extends PageObject<TComponent>> = (
  component: TComponent
) => PageObject<any> /* tslint:disable-line no-any */;

/**
 * `import {not} from '@pageobject/predicates';`
 */
export function not<TComponent extends PageObject<TComponent>>(
  predicate: Predicate<TComponent>
): Predicate<TComponent> {
  return async (component, index, components) => {
    const result = await predicate(component, index, components);

    return !result;
  };
}

/**
 * `import {and} from '@pageobject/predicates';`
 */
export function and<TComponent extends PageObject<TComponent>>(
  predicateA: Predicate<TComponent>,
  predicateB: Predicate<TComponent>
): Predicate<TComponent> {
  return async (component, index, components) => {
    const resultA = await predicateA(component, index, components);
    const resultB = await predicateB(component, index, components);

    return resultA && resultB;
  };
}

/**
 * `import {or} from '@pageobject/predicates';`
 */
export function or<TComponent extends PageObject<TComponent>>(
  predicateA: Predicate<TComponent>,
  predicateB: Predicate<TComponent>
): Predicate<TComponent> {
  return async (component, index, components) => {
    const resultA = await predicateA(component, index, components);
    const resultB = await predicateB(component, index, components);

    return resultA || resultB;
  };
}

/**
 * `import {xor} from '@pageobject/predicates';`
 */
export function xor<TComponent extends PageObject<TComponent>>(
  predicateA: Predicate<TComponent>,
  predicateB: Predicate<TComponent>
): Predicate<TComponent> {
  return async (component, index, components) => {
    const resultA = await predicateA(component, index, components);
    const resultB = await predicateB(component, index, components);

    return resultA ? !resultB : resultB;
  };
}

/**
 * `import {nth} from '@pageobject/predicates';`
 */
export function nth<TComponent extends PageObject<TComponent>>(
  n: number
): Predicate<TComponent> {
  return async (component, index) => index === n - 1;
}

/**
 * `import {attributeContains} from '@pageobject/predicates';`
 */
export function attributeContains<TComponent extends PageObject<TComponent>>(
  name: string,
  value: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getAttribute(name)).indexOf(value) > -1;
  };
}

/**
 * `import {attributeEquals} from '@pageobject/predicates';`
 */
export function attributeEquals<TComponent extends PageObject<TComponent>>(
  name: string,
  value: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getAttribute(name)) === value;
  };
}

/**
 * `import {attributeMatches} from '@pageobject/predicates';`
 */
export function attributeMatches<TComponent extends PageObject<TComponent>>(
  name: string,
  value: RegExp,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return value.test(await selection.getAttribute(name));
  };
}

/**
 * `import {htmlContains} from '@pageobject/predicates';`
 */
export function htmlContains<TComponent extends PageObject<TComponent>>(
  html: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getHtml()).indexOf(html) > -1;
  };
}

/**
 * `import {htmlEquals} from '@pageobject/predicates';`
 */
export function htmlEquals<TComponent extends PageObject<TComponent>>(
  html: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getHtml()) === html;
  };
}

/**
 * `import {htmlMatches} from '@pageobject/predicates';`
 */
export function htmlMatches<TComponent extends PageObject<TComponent>>(
  html: RegExp,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return html.test(await selection.getHtml());
  };
}

/**
 * `import {propertyEquals} from '@pageobject/predicates';`
 */
export function propertyEquals<TComponent extends PageObject<TComponent>>(
  name: string,
  value: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getProperty(name)) === value;
  };
}

/**
 * `import {tagNameContains} from '@pageobject/predicates';`
 */
export function tagNameContains<TComponent extends PageObject<TComponent>>(
  tagName: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getTagName()).indexOf(tagName) > -1;
  };
}

/**
 * `import {tagNameEquals} from '@pageobject/predicates';`
 */
export function tagNameEquals<TComponent extends PageObject<TComponent>>(
  tagName: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getTagName()) === tagName;
  };
}

/**
 * `import {tagNameMatches} from '@pageobject/predicates';`
 */
export function tagNameMatches<TComponent extends PageObject<TComponent>>(
  tagName: RegExp,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return tagName.test(await selection.getTagName());
  };
}

/**
 * `import {textContains} from '@pageobject/predicates';`
 */
export function textContains<TComponent extends PageObject<TComponent>>(
  text: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getText()).indexOf(text) > -1;
  };
}

/**
 * `import {textEquals} from '@pageobject/predicates';`
 */
export function textEquals<TComponent extends PageObject<TComponent>>(
  text: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getText()) === text;
  };
}

/**
 * `import {textMatches} from '@pageobject/predicates';`
 */
export function textMatches<TComponent extends PageObject<TComponent>>(
  text: RegExp,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return text.test(await selection.getText());
  };
}

/**
 * `import {urlContains} from '@pageobject/predicates';`
 */
export function urlContains<TComponent extends PageObject<TComponent>>(
  url: string
): Predicate<TComponent> {
  return async component => (await component.getUrl()).indexOf(url) > -1;
}

/**
 * `import {urlEquals} from '@pageobject/predicates';`
 */
export function urlEquals<TComponent extends PageObject<TComponent>>(
  url: string
): Predicate<TComponent> {
  return async component => (await component.getUrl()) === url;
}

/**
 * `import {urlMatches} from '@pageobject/predicates';`
 */
export function urlMatches<TComponent extends PageObject<TComponent>>(
  url: RegExp
): Predicate<TComponent> {
  return async component => url.test(await component.getUrl());
}

/**
 * `import {visible} from '@pageobject/predicates';`
 */
export function visible<TComponent extends PageObject<TComponent>>(): Predicate<
  TComponent
> {
  return async component => component.isVisible();
}
