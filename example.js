const {FlexiblePageObject} = require('@pageobject/flexible');
const {PuppeteerAdapter} = require('@pageobject/flexible-puppeteer');
const {TestCase, equals} = require('@pageobject/reliable');

class Root extends FlexiblePageObject {
  constructor(adapter) {
    super(adapter);

    this.selector = ':root';
  }
}

function describe(testCase, root) {
  testCase
    .perform(root.navigateTo('http://example.com/'))
    .assert(root.getPageTitle(equals('Example Domain')));
}

(async () => {
  const testCase = new TestCase(10000);
  const root = new Root(await PuppeteerAdapter.create());

  try {
    describe(testCase, root);

    await testCase.run();

    console.log('OK');
  } finally {
    await root.adapter.browser.close();
  }
})().catch(error => {
  console.error(error.toString());

  process.exit(1);
});
