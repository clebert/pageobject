function setup({testFramework}) {
  const {jest} = require('./package.json');

  /* https://github.com/wallabyjs/public/issues/1152#issuecomment-300151646 */
  delete jest.transform;

  testFramework.configure(jest);
}

module.exports = ({localProjectDir, projectCacheDir}) => {
  const {lstatSync, readdirSync} = require('fs');
  const {delimiter, join} = require('path');

  if ((process.env.NODE_PATH || '').indexOf(projectCacheDir) === -1) {
    process.env.NODE_PATH = process.env.NODE_PATH
      ? process.env.NODE_PATH + delimiter + projectCacheDir
      : projectCacheDir;
  }

  const packagesPath = join(localProjectDir, '@pageobject');

  for (const packageName of readdirSync(packagesPath)) {
    const packagePath = join(packagesPath, packageName);

    if (lstatSync(packagePath).isDirectory()) {
      const nodeModulesPath = join(packagePath, 'node_modules');

      process.env.NODE_PATH = process.env.NODE_PATH
        ? process.env.NODE_PATH + delimiter + nodeModulesPath
        : nodeModulesPath;
    }
  }

  return {
    debug: true,
    env: {type: 'node', runner: 'node'},
    files: ['@pageobject/*/fixtures/*', '@pageobject/*/src/*.ts'],
    hints: {
      ignoreCoverage: /istanbul ignore/
    },
    preprocessors: {
      '**/*.ts': file =>
        file.content.replace(/@pageobject\/(.*?)\/dist/g, '@pageobject/$1/src')
    },
    setup,
    testFramework: 'jest',
    tests: [
      '@pageobject/base/src/tests/*.test.ts',
      '@pageobject/web/src/tests/*.test.ts'
    ]
  };
};
