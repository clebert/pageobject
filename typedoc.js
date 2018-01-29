/* https://github.com/TypeStrong/typedoc#usage */

module.exports = {
  mode: 'file',
  ignoreCompilerErrors: false,

  /* Source file handling */

  exclude: '**/*.test.ts',
  includeDeclarations: false,
  externalPattern: '**/node_modules/**/*',
  excludeExternals: true,
  excludePrivate: true,

  /* TypeScript compiler */

  module: 'commonjs',
  target: 'es2017',

  /* Theming */

  theme: 'minimal',
  readme: 'none',
  hideGenerator: true,
  gitRevision: 'master'
};
