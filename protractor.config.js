exports.config = {
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {args: ['headless', 'disable-gpu']}
  },
  directConnect: true,
  specs: ['@pageobject/webdriver-protractor/dist/ProtractorWebDriver.spec.js']
};
