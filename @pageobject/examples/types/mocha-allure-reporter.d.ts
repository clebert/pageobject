/* https://github.com/allure-framework/allure-mocha#runtime-api */

declare interface AllureRuntime {
  createAttachement(
    name: string,
    content: Buffer | string,
    type?: string
  ): void;
}

declare var allure: AllureRuntime;
