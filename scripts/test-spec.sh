#! /usr/bin/env bash

export TESTS_DIR="$PWD/src/tests/spec"
export TS_NODE_COMPILER_OPTIONS='{"module": "commonjs"}'
export TS_NODE_PROJECT="$TESTS_DIR/tsconfig.json"

mocha -r ts-node/register -R min "$TESTS_DIR/**/*.ts"
