const findElementModule = jest.genMockFromModule<{
  findElement: jest.Mock;
}>('../_findElement');

findElementModule.findElement = jest.fn();

module.exports = findElementModule;
