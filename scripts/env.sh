#! /usr/bin/env bash

set -e
set -o pipefail
set -u

export PATH=$PATH:$PWD/node_modules/.bin
export BUILD_OUTPUT_DIR="${BUILD_OUTPUT_DIR:-./dist}"
export DOTENV_FILE="$SOURCE_DIR/.env"

if [ -f "$DOTENV_FILE" ]; then
    # shellcheck source=.env
    source "$DOTENV_FILE"
fi

TEST_APPS=${TEST_APPS:-$(cd "$SOURCE_DIR/src/app"; find . -type d -name "app*" | tr "$'\n'" ":")}