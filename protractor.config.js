const chromeArgs =
  process.env.CI === 'true'
    ? [
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox'
      ]
    : ['--headless', '--disable-gpu'];

exports.config = {
  capabilities: {browserName: 'chrome', chromeOptions: {args: chromeArgs}},
  directConnect: true,
  specs: ['@pageobject/webdriver-protractor/dist/ProtractorWebDriver.spec.js']
};
