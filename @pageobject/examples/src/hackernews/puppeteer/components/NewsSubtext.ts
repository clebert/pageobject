import {PageObject} from '@pageobject/class';
import {PuppeteerAdapter, predicates} from '@pageobject/puppeteer-adapter';
import {ElementHandle} from 'puppeteer';
import {HideLoginPage} from '../pages/LoginPage';

const {textEquals} = predicates;

export class NewsSubtext extends PageObject<ElementHandle, PuppeteerAdapter> {
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
