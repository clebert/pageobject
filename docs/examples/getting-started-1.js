const {Predicate, Test} = require('@pageobject/base');
const {JSDOMAdapter, WebComponent} = require('@pageobject/web');

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

(async () => {
  const adapter = new JSDOMAdapter();

  await Test.run(new App(adapter), 10, example);

  console.log(`OK: ${__filename}`);
})().catch(error => {
  console.error(error.toString());

  process.exit(1);
});
