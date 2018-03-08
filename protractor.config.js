exports.config = {
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {args: ['headless', 'disable-gpu']}
  },
  directConnect: true,
  specs: ['@pageobject/flexible-protractor/dist/ProtractorAdapter.spec.js']
};
