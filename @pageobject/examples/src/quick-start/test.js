require('chromedriver');

const {PageObject} = require('@pageobject/class');
const {SeleniumBrowser} = require('@pageobject/selenium-adapter');
const assert = require('assert');

class ExamplePage extends PageObject {
  async getHeadline() {
    const element = await this.findUniqueDescendant('h1');

    return element.getText();
  }
}

ExamplePage.InitialElements = ['h1'];
ExamplePage.url = /example\.com/;

(async () => {
  const browser = await SeleniumBrowser.launchHeadlessChrome();

  try {
    const page = await browser.open(ExamplePage, 'https://example.com/');

    assert.strictEqual(await page.getHeadline(), 'Example Domain');

    console.log('OK');
  } finally {
    await browser.quit();
  }
})().catch(e => {
  console.error(e.message);

  process.exit(1);
});
