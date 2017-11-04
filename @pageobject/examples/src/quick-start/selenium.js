require('chromedriver');

const {PageObject} = require('@pageobject/class');
const {SeleniumAdapter} = require('@pageobject/selenium-adapter');
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
  const adapter = await SeleniumAdapter.launchHeadlessChrome();

  await adapter.driver
    .manage()
    .timeouts()
    .implicitlyWait(5000);

  try {
    const page = await adapter.open(ExamplePage, 'https://example.com/');

    assert.strictEqual(await page.getHeadline(), 'Example Domain');

    console.log('OK');
  } finally {
    await adapter.driver.quit();
  }
})().catch(e => {
  console.error(e.message);

  process.exit(1);
});
