const retryOnErrorModule = jest.genMockFromModule<{
  retryOnError: jest.Mock;
}>('../_retryOnError');

retryOnErrorModule.retryOnError = jest.fn();

module.exports = retryOnErrorModule;
