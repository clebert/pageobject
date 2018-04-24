import {Test, TestCallback} from '@pageobject/base';
import {PuppeteerAdapter} from '@pageobject/puppeteer';
import {TodoMVC} from '..';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;

const args =
  process.env.CI === 'true'
    ? ['--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox']
    : [];

export function jestTest(name: string, callback: TestCallback<TodoMVC>): void {
  test(name, async () => {
    const adapter = await PuppeteerAdapter.create(
      {args},
      {waitUntil: 'domcontentloaded'}
    );

    try {
      await Test.run(new TodoMVC(adapter), 10, callback);
    } catch (e) {
      await adapter.page.screenshot({path: 'error-screenshot.png'});

      throw e;
    } finally {
      await adapter.quit();
    }
  });
}
