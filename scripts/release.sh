#!/bin/sh

set -e

# IMPORTANT: If you edit this file, please validate it using ShellCheck:
# http://www.shellcheck.net/

yarn run clean
yarn install
yarn test

PREVIOUS_RELEASE=$("$(yarn bin)"/git-latest-semver-tag)

lerna publish --skip-npm
lerna exec --ignore @pageobject/examples --since="${PREVIOUS_RELEASE}" -- yarn publish --access=public

git push --follow-tags origin master
