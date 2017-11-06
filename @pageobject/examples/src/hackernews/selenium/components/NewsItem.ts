import {PageObject} from '@pageobject/class';
import {SeleniumAdapter} from '@pageobject/selenium-adapter';
import {WebElement} from 'selenium-webdriver';
import {VoteLoginPage} from '../pages/LoginPage';

export class NewsItem extends PageObject<WebElement, SeleniumAdapter> {
  public static selector = 'tr.athing';

  public async getRank(): Promise<number> {
    const element = await this.findUniqueDescendant('span.rank');

    return parseInt(await element.getText(), 10);
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
