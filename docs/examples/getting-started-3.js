const {Predicate, Test} = require('@pageobject/base');
const {WebComponent} = require('@pageobject/web');
const {PuppeteerAdapter} = require('@pageobject/puppeteer');

const {is} = Predicate;

class Link extends WebComponent {
  get selector() {
    return 'a';
  }
}

class App extends WebComponent {
  get selector() {
    return ':root';
  }

  get moreInformationLink() {
    return new Link(this.adapter, this);
  }
}

function example(test, app) {
  test
    .perform(app.page.goto('http://example.com/'))
    .assert(app.page.getTitle(), is('Example Domain'))
    .assert(app.moreInformationLink.getText(), is('More information...'))
    .perform(app.moreInformationLink.click());
}

const args =
  process.env.CI === 'true'
    ? ['--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox']
    : [];

(async () => {
  const adapter = await PuppeteerAdapter.create({args});

  try {
    await Test.run(new App(adapter), 10, example);
  } finally {
    await adapter.quit();
  }

  console.log(`OK: ${__filename}`);
})().catch(error => {
  console.error(error.toString());

  process.exit(1);
});
