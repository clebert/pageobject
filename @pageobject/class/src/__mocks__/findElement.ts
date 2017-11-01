const findElementModule = jest.genMockFromModule<{
  findElement: jest.Mock;
}>('../findElement');

findElementModule.findElement = jest.fn();

module.exports = findElementModule;
