#! /usr/bin/env bash

set -e
set -o pipefail
set -u

export SOURCE_DIR="${SOURCE_DIR:-$PWD}"
export SCRIPTS_DIR="${SCRIPTS_DIR:-$SOURCE_DIR/scripts}"

# shellcheck source=scripts/env.sh
source "$SCRIPTS_DIR/env.sh"

pushd "$SOURCE_DIR/src/app"
ts-node index.ts
popd
