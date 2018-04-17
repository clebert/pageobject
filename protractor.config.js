const args =
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
  capabilities: {browserName: 'chrome', chromeOptions: {args}},
  directConnect: true,
  specs: ['@pageobject/protractor/dist/ProtractorAdapter.spec.js']
};
