import {PageObject} from '@pageobject/class';
import {PuppeteerAdapter} from '@pageobject/puppeteer-adapter';
import {ElementHandle} from 'puppeteer';
import {VoteLoginPage} from '../pages/LoginPage';

export class NewsItem extends PageObject<ElementHandle, PuppeteerAdapter> {
  public static selector = 'tr.athing';

  public async getRank(): Promise<number> {
    const innerTextHandle = await this.adapter.page.evaluateHandle(
      /* istanbul ignore next */
      element => element.innerText.trim(),
      await this.findUniqueDescendant('span.rank')
    );

    try {
      return parseInt(await innerTextHandle.jsonValue(), 10);
    } finally {
      await innerTextHandle.dispose();
    }
  }

  public async vote(): Promise<void> {
    const element = await this.findUniqueDescendant('div.votearrow');

    await element.click();
  }

  public async voteAsAnonymous(): Promise<VoteLoginPage> {
    await this.vote();

    return this.goto(VoteLoginPage);
  }
}
