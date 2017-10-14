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

  public async getTitle(): Promise<string> {
    const element = await this.findUniqueDescendant('a.storylink');

    return element.getText();
  }

  public async canVote(): Promise<boolean> {
    try {
      await this.findUniqueDescendant('a.nosee div.votearrow');

      return false;
    } catch {
      return true;
    }
  }

  public async vote(): Promise<void> {
    const element = await this.findUniqueDescendant('div.votearrow');

    await element.click();
  }

  public async voteAsAnonymous(): Promise<VoteLoginPage> {
    await this.vote();

    return this.waitFor(VoteLoginPage);
  }
}
