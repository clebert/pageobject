import {PageObject} from '@pageobject/class';
import {SeleniumAdapter} from '@pageobject/selenium-adapter';
import {WebElement} from 'selenium-webdriver';

const selectors = [
  'input[type="submit"][value="login"]',
  'input[type="submit"][value="create account"]'
];

export class LoginPage extends PageObject<WebElement, SeleniumAdapter> {
  public static selectors = selectors;
  public static url = /login/;

  public async displaysMessage(message: string): Promise<boolean> {
    const element = await this.findSelf();
    const text = await element.getText();

    return text.indexOf(message) > -1;
  }
}

export class HideLoginPage extends LoginPage {
  public static selectors = selectors;
  public static url = /hide\?id=[0-9]+/;
}

export class VoteLoginPage extends LoginPage {
  public static selectors = selectors;
  public static url = /vote\?id=[0-9]+/;
}
