#!/bin/sh

set -e

# IMPORTANT: If you edit this file, please validate it using ShellCheck:
# http://www.shellcheck.net/

rm -rf node_modules/@types/lodash

rm -rf docs/api/flexible
"$(yarn bin)"/typedoc --out docs/api/flexible ./@pageobject/flexible

rm -rf docs/api/flexible-protractor
"$(yarn bin)"/typedoc --out docs/api/flexible-protractor ./@pageobject/flexible-protractor

rm -rf docs/api/flexible-puppeteer
"$(yarn bin)"/typedoc --out docs/api/flexible-puppeteer ./@pageobject/flexible-puppeteer

rm -rf docs/api/flexible-selenium
"$(yarn bin)"/typedoc --out docs/api/flexible-selenium ./@pageobject/flexible-selenium

rm -rf docs/api/reliable
"$(yarn bin)"/typedoc --out docs/api/reliable ./@pageobject/reliable

rm -rf docs/api/stable
"$(yarn bin)"/typedoc --out docs/api/stable ./@pageobject/stable

"$(yarn bin)"/replace-in-file '/Defined in .+node_modules./g' 'Defined in ' 'docs/**/*.html' --isRegex --verbose

if test -n "$(git status --porcelain)"
then
  echo 'Working tree is dirty'

  exit 1
fi
