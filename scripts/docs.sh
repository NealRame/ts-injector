#! /usr/bin/env bash

BASE_DIR="${BASE_DIR:-$PWD}"
OUTPUT_DIR="${OUTPUT_DIR:-"${BASE_DIR}/docs"}"

rm -fr "$OUTPUT_DIR"

PATH="$PWD/node_modules/.bin:$PATH" \
    typedoc \
        --excludePrivate \
        --excludeProtected \
        --out "$OUTPUT_DIR" \
        --plugin typedoc-github-wiki-theme \
        --plugin typedoc-plugin-markdown \
        --readme none \
        --tsconfig ./src/lib/tsconfig.json \
        ./src/lib/*.ts
