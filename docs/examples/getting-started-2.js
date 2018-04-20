const {Predicate, Test} = require('@pageobject/base');
const {WebBrowser} = require('@pageobject/web');
const {PuppeteerAdapter} = require('@pageobject/puppeteer');

function example(test) {
  const browser = new WebBrowser(test.adapter);

  test.perform(browser.navigateTo('http://example.com/'));

  test.assert(browser.getPageTitle(), Predicate.is('Example Domain'));
}

const args =
  process.env.CI === 'true'
    ? ['--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox']
    : [];

(async () => {
  await Test.run(await PuppeteerAdapter.create({args}), 10, example);

  console.log(`OK: ${__filename}`);
})().catch(error => {
  console.error(error.toString());

  process.exit(1);
});
