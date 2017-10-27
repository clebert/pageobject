import {PageObject} from '@pageobject/class';
import {SeleniumAdapter, predicates} from '@pageobject/selenium-adapter';
import {WebElement} from 'selenium-webdriver';
import {HideLoginPage} from '../pages/LoginPage';

const {textEquals} = predicates;

export class NewsSubtext extends PageObject<WebElement, SeleniumAdapter> {
  public static selector = 'td.subtext';

  public async getScore(): Promise<number> {
    const element = await this.findUniqueDescendant('span.score');

    return parseInt(await element.getText(), 10);
  }

  public async hide(): Promise<void> {
    const element = await this.findUniqueDescendant('a', textEquals('hide'));

    await element.click();
  }

  public async hideAsAnonymous(): Promise<HideLoginPage> {
    await this.hide();

    return this.goto(HideLoginPage);
  }
}
