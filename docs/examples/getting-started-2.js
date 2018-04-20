const {Predicate, Test} = require('@pageobject/base');
const {WebBrowser} = require('@pageobject/web');
const {PuppeteerAdapter} = require('@pageobject/puppeteer');

function example(test) {
  const browser = new WebBrowser(test.adapter);

  test.perform(browser.navigateTo('http://example.com/'));

  test.assert(browser.getPageTitle(), Predicate.is('Example Domain'));
}

(async () => {
  const adapter = await PuppeteerAdapter.create();

  try {
    await Test.run(adapter, 10, example);

    console.log(`OK: ${__filename}`);
  } finally {
    await adapter.quit();
  }
})().catch(error => {
  console.error(error.toString());

  process.exit(1);
});
