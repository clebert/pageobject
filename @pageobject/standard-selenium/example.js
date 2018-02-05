require('chromedriver');

const {createRetryEngine} = require('@pageobject/engine');
const {StandardPageObject} = require('@pageobject/standard');
const {SeleniumPage} = require('@pageobject/standard-selenium');
const assert = require('assert');
const {Builder} = require('selenium-webdriver');

class Root extends StandardPageObject {
  get selector() {
    return ':root';
  }
}

const {retryOnError} = createRetryEngine(5000);

(async () => {
  const driver = await new Builder()
    .withCapabilities({
      browserName: 'chrome',
      chromeOptions: {args: ['headless', 'disable-gpu']}
    })
    .build();

  try {
    const page = await SeleniumPage.load('http://example.com/', driver);
    const root = new Root(page);

    await retryOnError(async () =>
      assert.strictEqual(await root.getPageTitle(), 'Example Domain')
    );
  } finally {
    await driver.quit();
  }

  console.log('Selenium example -> OK');
})().catch(error => {
  console.error(`Selenium example -> Error: ${error.message}`);

  process.exit(1);
});
