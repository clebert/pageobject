import {FlexibleAdapterTestSuite} from '@pageobject/flexible';
import {browser} from 'protractor';
import {ProtractorAdapter} from '.';

describe('ProtractorAdapter', () => {
  it('should pass the FlexibleAdapterTestSuite successfully', async () => {
    const adapter = new ProtractorAdapter(browser);
    const testSuite = new FlexibleAdapterTestSuite(adapter);

    await testSuite.testAll();
  });
});
