const {Predicate, Test} = require('@pageobject/base');
const {WebComponent} = require('@pageobject/web');
const {PuppeteerAdapter} = require('@pageobject/puppeteer');

const {is} = Predicate;

class App extends WebComponent {
  get selector() {
    return ':root';
  }
}

function example(test, app) {
  test
    .perform(app.page.goto('http://example.com/'))
    .assert(app.page.getTitle(), is('Example Domain'));
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
