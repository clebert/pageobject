import {PageObject} from '@pageobject/class';
import {SeleniumAdapter, predicates} from '@pageobject/selenium-adapter';
import {WebElement} from 'selenium-webdriver';
import {HideLoginPage} from '../pages/LoginPage';

const {textEquals} = predicates;

export class NewsSubtext extends PageObject<WebElement, SeleniumAdapter> {
  public static selector = 'td.subtext';

  public async hide(): Promise<void> {
    const element = await this.findUniqueDescendant('a', textEquals('hide'));

    await element.click();
  }

  public async hideAsAnonymous(): Promise<HideLoginPage> {
    await this.hide();

    console.log('SCREENSHOT', await this.adapter.driver.takeScreenshot());

    return this.goto(HideLoginPage);
  }
}
