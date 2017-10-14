import {Predicate} from '@pageobject/class';
import {WebElement} from 'selenium-webdriver';

export function atIndex(n: number): Predicate<WebElement> {
  return async (element, index) => index === n;
}

export function textEquals(value: string): Predicate<WebElement> {
  return async element => (await element.getText()) === value;
}
