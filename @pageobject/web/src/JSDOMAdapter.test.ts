import {JSDOMAdapter, WebAdapterTest} from '.';

describe('JSDOMAdapter', () => {
  it('should pass the WebAdapterTest successfully', async () => {
    await new WebAdapterTest(new JSDOMAdapter()).run();
  });
});
