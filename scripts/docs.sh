#!/bin/sh

set -e

# IMPORTANT: If you edit this file, please validate it using ShellCheck:
# http://www.shellcheck.net/

rm -rf docs/api/

"$(npm bin)"/typedoc --entryPoint \"PageObject\" --out docs/api/class ./@pageobject/class
"$(npm bin)"/typedoc --entryPoint \"predicates\" --out docs/api/predicates ./@pageobject/predicates
