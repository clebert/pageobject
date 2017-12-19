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

    return (await selection.element.getAttribute(name)).indexOf(value) > -1;
  };
}

export function attributeEquals<TComponent extends PageObject<TComponent>>(
  name: string,
  value: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.element.getAttribute(name)) === value;
  };
}

export function attributeMatches<TComponent extends PageObject<TComponent>>(
  name: string,
  value: RegExp,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return value.test(await selection.element.getAttribute(name));
  };
}

export function displayed<TComponent extends PageObject<TComponent>>(
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return selection.element.isDisplayed();
  };
}

export function tagNameContains<TComponent extends PageObject<TComponent>>(
  tagName: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.element.getTagName()).indexOf(tagName) > -1;
  };
}

export function tagNameEquals<TComponent extends PageObject<TComponent>>(
  tagName: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.element.getTagName()) === tagName;
  };
}

export function tagNameMatches<TComponent extends PageObject<TComponent>>(
  tagName: RegExp,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return tagName.test(await selection.element.getTagName());
  };
}

export function textContains<TComponent extends PageObject<TComponent>>(
  text: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.element.getText()).indexOf(text) > -1;
  };
}

export function textEquals<TComponent extends PageObject<TComponent>>(
  text: string,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return (await selection.element.getText()) === text;
  };
}

export function textMatches<TComponent extends PageObject<TComponent>>(
  text: RegExp,
  selector?: Selector<TComponent>
): Predicate<TComponent> {
  return async component => {
    const selection = selector ? selector(component) : component;

    return text.test(await selection.element.getText());
  };
}
