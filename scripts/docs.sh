#!/bin/sh

set -e

# IMPORTANT: If you edit this file, please validate it using ShellCheck:
# http://www.shellcheck.net/

rm -rf docs/api/

rm -f @pageobject/puppeteer-adapter/node_modules/puppeteer/lib/externs.d.ts
rm -f @pageobject/puppeteer-adapter/node_modules/puppeteer/node6/externs.d.ts

"$(npm bin)"/typedoc --out docs/api/adapter-test-suite ./@pageobject/adapter-test-suite
"$(npm bin)"/typedoc --out docs/api/class ./@pageobject/class
"$(npm bin)"/typedoc --out docs/api/predicates ./@pageobject/predicates
"$(npm bin)"/typedoc --out docs/api/puppeteer-adapter ./@pageobject/puppeteer-adapter
"$(npm bin)"/typedoc --out docs/api/selenium-adapter ./@pageobject/selenium-adapter
