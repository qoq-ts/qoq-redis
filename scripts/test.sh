#!/usr/bin/env bash

set -e
docker pull redis:${1:-4}-alpine
docker run -it -p 7698:6379 -d --name qoq-redis redis --requirepass 123456

npx nyc mocha ./test/**/*.test.ts -r ts-node/register --recursive --exit

docker rm -f qoq-redis
