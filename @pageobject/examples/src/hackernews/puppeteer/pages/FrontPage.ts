import {PageObject} from '@pageobject/class';
import {PuppeteerAdapter} from '@pageobject/puppeteer-adapter';
import {ElementHandle} from 'puppeteer';
import {NewsList} from '../components/NewsList';

export class FrontPage extends PageObject<ElementHandle, PuppeteerAdapter> {
  public static selectors = [NewsList.selector];
  public static url = /\/news$/;

  public static async open(adapter: PuppeteerAdapter): Promise<FrontPage> {
    return adapter.open(FrontPage, 'https://news.ycombinator.com/news');
  }

  public selectNewsList(): NewsList {
    return this.selectUniqueDescendant(NewsList);
  }
}
