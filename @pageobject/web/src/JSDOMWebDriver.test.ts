import {JSDOMWebDriver, WebDriverTest} from '.';

describe('JSDOMWebDriver', () => {
  it('should pass the WebDriverTest successfully', async () => {
    await new WebDriverTest(new JSDOMWebDriver()).testAll();
  });
});
