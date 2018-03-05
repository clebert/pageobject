exports.config = {
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {args: ['headless', 'disable-gpu']}
  },
  directConnect: true,
  specs: ['dist/ProtractorAdapter.spec.js']
};
