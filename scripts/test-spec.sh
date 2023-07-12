#! /usr/bin/env bash

export TESTS_DIR="$PWD/src/tests"
export TS_NODE_COMPILER_OPTIONS='{"module": "commonjs"}'
export TS_NODE_PROJECT="$TESTS_DIR/tsconfig.json"

PATH="$PWD/node_modules/.bin:$PATH" mocha -r ts-node/register -R min "$TESTS_DIR/**/*.spec.ts"
