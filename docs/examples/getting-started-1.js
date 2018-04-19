const {Predicate, Test} = require('@pageobject/base');
const {JSDOMAdapter, WebBrowser} = require('@pageobject/web');

function example(test) {
  const browser = new WebBrowser(test.adapter);

  test.perform(browser.navigateTo('http://example.com/'));

  test.assert(browser.getPageTitle(), Predicate.is('Example Domain'));
}

(async () => {
  await Test.run(new JSDOMAdapter(), 10, example);

  console.log(`OK: ${__filename}`);
})().catch(error => console.error(error.toString()));
