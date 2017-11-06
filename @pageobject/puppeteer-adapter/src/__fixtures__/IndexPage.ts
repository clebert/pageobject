import {PageObject} from '@pageobject/class';
import {ElementHandle} from 'puppeteer';
import {PuppeteerAdapter} from '..';

export class IndexPage extends PageObject<ElementHandle, PuppeteerAdapter> {
  public static selectors = ['#foo', '#bar'];
  public static url = /index\.html/;
}
