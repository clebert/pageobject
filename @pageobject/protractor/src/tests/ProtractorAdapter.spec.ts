import {WebAdapterTest} from '@pageobject/web';
import {browser} from 'protractor';
import {ProtractorAdapter} from '..';

describe('ProtractorAdapter', () => {
  it('should pass the WebAdapterTest successfully', async () => {
    await new WebAdapterTest(new ProtractorAdapter(browser)).run();
  });
});
