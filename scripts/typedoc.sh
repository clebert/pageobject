#!/bin/sh

set -e

# IMPORTANT: If you edit this file, please validate it using ShellCheck:
# http://www.shellcheck.net/

rm -rf docs/api/

"$(yarn bin)"/typedoc --out docs/api/flexible ./@pageobject/flexible
"$(yarn bin)"/typedoc --out docs/api/flexible-puppeteer ./@pageobject/flexible-puppeteer
"$(yarn bin)"/typedoc --out docs/api/flexible-selenium ./@pageobject/flexible-selenium
"$(yarn bin)"/typedoc --out docs/api/reliable ./@pageobject/reliable
"$(yarn bin)"/typedoc --out docs/api/stable ./@pageobject/stable

"$(yarn bin)"/replace-in-file '/Defined in .+node_modules./g' 'Defined in ' 'docs/**/*.html' --isRegex --verbose

if test -n "$(git status --porcelain)"
then
  echo 'Working tree is dirty'

  exit 1
fi
