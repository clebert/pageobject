const {PuppeteerAdapter} = require('@pageobject/puppeteer-adapter');
const assert = require('assert');
const {ExamplePage} = require('./ExamplePage');

(async () => {
  const adapter = await PuppeteerAdapter.launchChrome();

  try {
    const page = await adapter.open(ExamplePage, 'https://example.com/');

    assert.strictEqual(await page.getHeadline(), 'Example Domain');

    console.log('OK');
  } finally {
    await adapter.browser.close();
  }
})().catch(e => {
  console.error(e.message);

  process.exit(1);
});
