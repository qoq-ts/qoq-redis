#!/usr/bin/env bash

set -e

rm -rf ./es/ ./lib/

rm -rf ./build
./node_modules/.bin/tsc  --module commonjs
mv ./build/src ./lib

rm -rf ./build
./node_modules/.bin/tsc
mv ./build/src ./es

cat > ./es/package.json <<EOF
{
  "type": "module"
}
EOF
