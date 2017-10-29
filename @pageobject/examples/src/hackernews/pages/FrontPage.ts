import {PageObject} from '@pageobject/class';
import {SeleniumAdapter, SeleniumBrowser} from '@pageobject/selenium-adapter';
import {WebElement} from 'selenium-webdriver';
import {NewsList} from '../components/NewsList';

export class FrontPage extends PageObject<WebElement, SeleniumAdapter> {
  public static InitialComponents = [NewsList];
  public static url = /\/news$/;

  public static async open(browser: SeleniumBrowser): Promise<FrontPage> {
    return browser.open(FrontPage, 'https://news.ycombinator.com/news');
  }

  public selectNewsList(): NewsList {
    return this.selectUniqueDescendant(NewsList);
  }
}
