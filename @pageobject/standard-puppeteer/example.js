const {createRetryEngine} = require('@pageobject/engine');
const {StandardPageObject} = require('@pageobject/standard');
const {PuppeteerPage} = require('@pageobject/standard-puppeteer');

const assert = require('assert');

const {launch} = require('puppeteer');

class Root extends StandardPageObject {
  get selector() {
    return ':root';
  }
}

const {retryOnError} = createRetryEngine(5000);

(async () => {
  const browser = await launch();

  try {
    const page = await PuppeteerPage.load('http://example.com/', browser);
    const root = new Root(page);

    await retryOnError(async () =>
      assert.strictEqual(await root.getPageTitle(), 'Example Domain')
    );
  } finally {
    await browser.close();
  }

  console.log('Puppeteer example -> OK');
})().catch(error => {
  console.error(`Puppeteer example -> Error: ${error.message}`);

  process.exit(1);
});
