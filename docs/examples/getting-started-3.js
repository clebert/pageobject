const {Predicate, Test} = require('@pageobject/base');
const {WebBrowser, WebComponent} = require('@pageobject/web');
const {PuppeteerAdapter} = require('@pageobject/puppeteer');

class Link extends WebComponent {
  get selector() {
    return 'a';
  }
}

class ExamplePage extends WebComponent {
  get selector() {
    return ':root';
  }

  get moreInformationLink() {
    return new Link(this.adapter, this);
  }
}

function example(test) {
  const browser = new WebBrowser(test.adapter);

  test.perform(browser.navigateTo('http://example.com/'));

  test.assert(browser.getPageTitle(), Predicate.is('Example Domain'));

  const page = new ExamplePage(test.adapter);

  test.assert(
    page.moreInformationLink.getText(),
    Predicate.is('More information...')
  );

  test.perform(page.moreInformationLink.click());
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
