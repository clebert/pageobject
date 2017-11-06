import {PageObject} from '@pageobject/class';
import {SeleniumAdapter, predicates} from '@pageobject/selenium-adapter';
import {WebElement} from 'selenium-webdriver';
import {NewsItem} from './NewsItem';
import {NewsSubtext} from './NewsSubtext';

export interface News {
  readonly item: NewsItem;
  readonly subtext: NewsSubtext;
}

const {atIndex} = predicates;

export class NewsList extends PageObject<WebElement, SeleniumAdapter> {
  public static selector = 'table.itemlist';

  public selectNews(n: number = 1): News {
    return {
      item: this.selectUniqueDescendant(NewsItem, atIndex(n - 1)),
      subtext: this.selectUniqueDescendant(NewsSubtext, atIndex(n - 1))
    };
  }
}
