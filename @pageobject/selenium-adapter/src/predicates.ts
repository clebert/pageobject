import {Predicate} from '@pageobject/class';
import {WebElement} from 'selenium-webdriver';
import {SeleniumAdapter} from './SeleniumAdapter';

export function atIndex(n: number): Predicate<WebElement, SeleniumAdapter> {
  return async (adapter, element, index) => index === n;
}

export function textEquals(
  value: string
): Predicate<WebElement, SeleniumAdapter> {
  return async (adapter, element) => (await element.getText()) === value;
}
