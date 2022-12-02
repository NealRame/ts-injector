#! /usr/bin/env bash

set -e
set -o pipefail
set -u

export SOURCE_DIR="${SOURCE_DIR:-$PWD}"
export SCRIPTS_DIR="${SCRIPTS_DIR:-$SOURCE_DIR/scripts}"

# shellcheck source=scripts/env.sh
source "$SCRIPTS_DIR/env.sh"

IFS=$':' read -r -a APPS <<< "$TEST_APPS"
for APP in "${APPS[@]}"; do
    APP_PATH="$SOURCE_DIR/src/tests/app/$APP/index.ts"
    echo "===================================================================="
    echo "Testing $APP"
    echo "===================================================================="
    [ -f "$APP_PATH" ] && ts-node "$APP_PATH"
done
