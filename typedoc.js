/* https://github.com/TypeStrong/typedoc#usage */

module.exports = {
  mode: 'modules',
  ignoreCompilerErrors: false,

  /* Source file handling */

  exclude: '**/index.ts',
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
  hideGenerator: true
};
