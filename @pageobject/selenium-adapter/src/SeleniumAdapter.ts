import {Adapter} from '@pageobject/class';
import {By, WebDriver, WebElement} from 'selenium-webdriver';

export class SeleniumAdapter implements Adapter<WebElement> {
  public readonly driver: WebDriver;

  public constructor(driver: WebDriver) {
    this.driver = driver;
  }

  public async findElements(
    selector: string,
    parent?: WebElement
  ): Promise<WebElement[]> {
    return (parent || this.driver).findElements(By.css(selector));
  }

  public async getCurrentUrl(): Promise<string> {
    return this.driver.getCurrentUrl();
  }
}
