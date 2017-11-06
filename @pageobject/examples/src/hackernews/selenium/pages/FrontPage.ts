import {PageObject} from '@pageobject/class';
import {SeleniumAdapter} from '@pageobject/selenium-adapter';
import {WebElement} from 'selenium-webdriver';
import {NewsList} from '../components/NewsList';

export class FrontPage extends PageObject<WebElement, SeleniumAdapter> {
  public static selectors = [NewsList.selector];
  public static url = /\/news$/;

  public static async open(adapter: SeleniumAdapter): Promise<FrontPage> {
    return adapter.open(FrontPage, 'https://news.ycombinator.com/news');
  }

  public selectNewsList(): NewsList {
    return this.selectUniqueDescendant(NewsList);
  }
}
