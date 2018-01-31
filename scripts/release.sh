#!/bin/sh

set -e

# IMPORTANT: If you edit this file, please validate it using ShellCheck:
# http://www.shellcheck.net/

yarn run clean
yarn install
yarn test

PREVIOUS_RELEASE=$("$(yarn bin)"/git-latest-semver-tag)

lerna publish

git push --follow-tags origin master
