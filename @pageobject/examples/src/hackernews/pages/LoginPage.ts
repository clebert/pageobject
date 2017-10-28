import {PageObject} from '@pageobject/class';
import {SeleniumAdapter} from '@pageobject/selenium-adapter';
import {WebElement} from 'selenium-webdriver';

const InitialElements = [
  'input[type="submit"][value="login"]',
  'input[type="submit"][value="create account"]'
];

export class LoginPage extends PageObject<WebElement, SeleniumAdapter> {
  public static InitialElements = InitialElements;
  public static url = /login/;

  public async displaysMessage(message: string): Promise<boolean> {
    const element = await this.findSelf();
    const html = await element.getText();

    return html.indexOf(message) > -1;
  }
}

export class HideLoginPage extends LoginPage {
  public static InitialElements = InitialElements;
  public static url = /hide\?id=[0-9]+/;
}

export class VoteLoginPage extends LoginPage {
  public static InitialElements = InitialElements;
  public static url = /vote\?id=[0-9]+/;
}
