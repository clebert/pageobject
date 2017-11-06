import {PageObject} from '@pageobject/class';
import {PuppeteerAdapter} from '@pageobject/puppeteer-adapter';
import {ElementHandle} from 'puppeteer';

const selectors = [
  'input[type="submit"][value="login"]',
  'input[type="submit"][value="create account"]'
];

export class LoginPage extends PageObject<ElementHandle, PuppeteerAdapter> {
  public static selectors = selectors;
  public static url = /login/;

  public async displaysMessage(message: string): Promise<boolean> {
    const innerTextHandle = await this.adapter.page.evaluateHandle(
      /* istanbul ignore next */
      element => element.innerText.trim(),
      await this.findSelf()
    );

    try {
      return (await innerTextHandle.jsonValue()).indexOf(message) > -1;
    } finally {
      await innerTextHandle.dispose();
    }
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
