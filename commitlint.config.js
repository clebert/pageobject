const {getPackages} = require('@commitlint/config-lerna-scopes').utils;

module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'header-max-length': [2, 'always', 140],
    'scope-empty': [2, 'never'],
    'scope-enum': () => [2, 'always', [...getPackages(), 'all']],
    'subject-case': [2, 'always', ['lower-case', 'kebab-case']]
  }
};
