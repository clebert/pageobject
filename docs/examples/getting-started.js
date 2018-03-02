const {FlexiblePageObject} = require('@pageobject/flexible');
const {PuppeteerAdapter} = require('@pageobject/flexible-puppeteer');
const {TestCase, equals} = require('@pageobject/reliable');

class Page extends FlexiblePageObject {
  get selector() {
    return ':root'; // https://developer.mozilla.org/en-US/docs/Web/CSS/:root
  }
}

function describe(testCase, page) {
  testCase
    .perform(page.navigateTo('http://example.com/'))
    .assert(page.getPageTitle(equals('Example Domain')));
}

(async () => {
  const testCase = new TestCase(3);
  const page = new Page(await PuppeteerAdapter.create());

  try {
    describe(testCase, page);

    await testCase.run();

    console.log('OK');
  } finally {
    await page.adapter.browser.close();
  }
})().catch(error => {
  console.error(error.toString());

  process.exit(1);
});
