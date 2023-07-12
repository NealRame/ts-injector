#! /usr/bin/env bash

set -e
set -o pipefail
set -u

export BASE_DIR="${BASE_DIR:-$PWD}"
export OUTPUT_DIR="${OUTPUT_DIR:-"${BASE_DIR}/wiki"}"
export PATH="$PWD/node_modules/.bin:$PATH"

if [ ! -d "$OUTPUT_DIR" ]; then
    mkdir -p "$OUTPUT_DIR"
fi

TMP_DIR=$(mktemp -d)

typedoc \
    --excludeExternals \
    --excludePrivate \
    --excludeProtected \
    --out "$TMP_DIR" \
    --plugin typedoc-github-wiki-theme \
    --plugin typedoc-plugin-markdown \
    --readme none \
    --tsconfig ./src/lib/tsconfig.json \
    ./src/lib/*.ts

find "$OUTPUT_DIR" -type f -name "*.md" -delete
find "$TMP_DIR" -type f -name "*.md" | while read -r FILE; do
    mv "$FILE" "$OUTPUT_DIR"
done
