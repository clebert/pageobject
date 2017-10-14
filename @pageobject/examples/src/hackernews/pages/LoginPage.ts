import {PageObject} from '@pageobject/class';
import {SeleniumAdapter} from '@pageobject/selenium-adapter';
import {WebElement} from 'selenium-webdriver';

export class LoginPage extends PageObject<WebElement, SeleniumAdapter> {
  public static InitialComponents = [];
  public static url = /login/;

  public async displaysMessage(message: string): Promise<boolean> {
    const element = await this.findSelf();
    const html = await element.getText();

    return html.indexOf(message) > -1;
  }
}

export class HideLoginPage extends LoginPage {
  public static InitialComponents = [];
  public static url = /hide\?id=[0-9]+/;
}

export class VoteLoginPage extends LoginPage {
  public static InitialComponents = [];
  public static url = /vote\?id=[0-9]+/;
}
