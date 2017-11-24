import {PageObject, Predicate} from '@pageobject/class';

export type Selector<TComponent extends PageObject<TComponent>> = (
  component: TComponent
) => PageObject<any> /* tslint:disable-line no-any */;

export function not<TComponent extends PageObject<TComponent>>(
  predicate: Predicate<TComponent>
): Predicate<TComponent> {
  return async (component, index, components) => {
    const result = await predicate(component, index, components);

    return !result;
  };
}

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

export function nth<TComponent extends PageObject<TComponent>>(
  n: number
): Predicate<TComponent> {
  return async (component, index) => index === n - 1;
}

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

export function htmlContains<TComponent extends PageObject<TComponent>>(
  html: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getHtml()).indexOf(html) > -1;
  };
}

export function htmlEquals<TComponent extends PageObject<TComponent>>(
  html: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getHtml()) === html;
  };
}

export function htmlMatches<TComponent extends PageObject<TComponent>>(
  html: RegExp,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return html.test(await selection.getHtml());
  };
}

export function propertyContains<TComponent extends PageObject<TComponent>>(
  name: string,
  value: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getProperty(name)).indexOf(value) > -1;
  };
}

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

export function propertyMatches<TComponent extends PageObject<TComponent>>(
  name: string,
  value: RegExp,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return value.test(await selection.getProperty(name));
  };
}

export function textContains<TComponent extends PageObject<TComponent>>(
  text: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getText()).indexOf(text) > -1;
  };
}

export function textEquals<TComponent extends PageObject<TComponent>>(
  text: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.getText()) === text;
  };
}

export function textMatches<TComponent extends PageObject<TComponent>>(
  text: RegExp,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return text.test(await selection.getText());
  };
}

export function visible<TComponent extends PageObject<TComponent>>(): Predicate<
  TComponent
> {
  return async component => component.isVisible();
}
