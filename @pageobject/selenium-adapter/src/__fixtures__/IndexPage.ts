import {PageObject} from '@pageobject/class';
import {WebElement} from 'selenium-webdriver';
import {SeleniumAdapter} from '..';

export class IndexPage extends PageObject<WebElement, SeleniumAdapter> {
  public static selectors = ['#foo', '#bar'];
  public static url = /index\.html/;
}
