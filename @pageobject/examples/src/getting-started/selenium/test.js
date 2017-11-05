require('chromedriver');

const {SeleniumAdapter} = require('@pageobject/selenium-adapter');
const assert = require('assert');
const {ExamplePage} = require('./ExamplePage');

(async () => {
  const adapter = await SeleniumAdapter.launchHeadlessChrome();

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
