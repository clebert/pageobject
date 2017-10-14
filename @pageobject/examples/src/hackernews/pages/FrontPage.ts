import {PageObject} from '@pageobject/class';
import {SeleniumAdapter} from '@pageobject/selenium-adapter';
import {WebElement} from 'selenium-webdriver';
import {NewsList} from '../components/NewsList';

export class FrontPage extends PageObject<WebElement, SeleniumAdapter> {
  public static InitialComponents = [NewsList];
  public static url = /\/news$/;

  public selectNewsList(): NewsList {
    return this.selectUniqueDescendant(NewsList);
  }
}
