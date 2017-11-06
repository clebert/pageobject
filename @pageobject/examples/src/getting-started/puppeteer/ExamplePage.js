const {PageObject} = require('@pageobject/class');

class ExamplePage extends PageObject {
  async getHeadline() {
    const innerTextHandle = await this.adapter.page.evaluateHandle(
      element => element.innerText.trim(),
      await this.findUniqueDescendant('h1')
    );

    try {
      return innerTextHandle.jsonValue();
    } finally {
      await innerTextHandle.dispose();
    }
  }
}

ExamplePage.selectors = ['h1'];
ExamplePage.url = /example\.com/;

exports.ExamplePage = ExamplePage;
