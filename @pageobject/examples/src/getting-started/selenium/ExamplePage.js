const {PageObject} = require('@pageobject/class');

class ExamplePage extends PageObject {
  async getHeadline() {
    const element = await this.findUniqueDescendant('h1');

    return element.getText();
  }
}

ExamplePage.selectors = ['h1'];
ExamplePage.url = /example\.com/;

exports.ExamplePage = ExamplePage;
