import {PageObject} from '@pageobject/class';
import {textEquals} from '@pageobject/predicates';
import {SeleniumAdapter} from '@pageobject/selenium-adapter';
import {WebElement} from 'selenium-webdriver';
import {HideLoginPage} from '../pages/LoginPage';

export class NewsSubtext extends PageObject<WebElement, SeleniumAdapter> {
  public static selector = 'td.subtext';

  public async hide(): Promise<void> {
    const element = await this.findUniqueDescendant('a', textEquals('hide'));

    await element.click();
  }

  public async hideAsAnonymous(): Promise<HideLoginPage> {
    await this.hide();

    return this.goto(HideLoginPage);
  }
}
