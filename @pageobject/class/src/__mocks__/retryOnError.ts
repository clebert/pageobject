const retryOnErrorModule = jest.genMockFromModule<{
  retryOnError: jest.Mock;
}>('../retryOnError');

retryOnErrorModule.retryOnError = jest.fn();

module.exports = retryOnErrorModule;
