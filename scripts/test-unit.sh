#! /usr/bin/env bash

TS_NODE_COMPILER_OPTIONS='{"module": "commonjs"}' \
TS_NODE_PROJECT="$PWD/src/tests/tsconfig.json" \
    mocha -r ts-node/register -R min "src/tests/**/*.ts"
