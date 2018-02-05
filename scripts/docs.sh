#!/bin/sh

set -e

# IMPORTANT: If you edit this file, please validate it using ShellCheck:
# http://www.shellcheck.net/

rm -rf docs/api/

"$(yarn bin)"/typedoc --out docs/api/core ./@pageobject/core
"$(yarn bin)"/typedoc --out docs/api/engine ./@pageobject/engine
"$(yarn bin)"/typedoc --out docs/api/predicates ./@pageobject/predicates
"$(yarn bin)"/typedoc --out docs/api/standard ./@pageobject/standard
"$(yarn bin)"/typedoc --out docs/api/standard-puppeteer ./@pageobject/standard-puppeteer
"$(yarn bin)"/typedoc --out docs/api/standard-selenium ./@pageobject/standard-selenium
"$(yarn bin)"/typedoc --out docs/api/standard-test ./@pageobject/standard-test

"$(yarn bin)"/replace-in-file '/Defined in .+node_modules./g' 'Defined in ' 'docs/**/*.html' --isRegex --verbose

if test -n "$(git status --porcelain)"
then
  echo 'Working tree is dirty'

  exit 1
fi
