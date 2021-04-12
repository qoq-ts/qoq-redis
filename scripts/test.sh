#!/usr/bin/env bash

trap "docker rm -f qoq-redis" 0

set -e
docker pull redis:${1:-4}-alpine
docker run -it -p 7698:6379 -d --name qoq-redis redis --requirepass 123456

npx nyc mocha ./test/**/*.test.ts -r ts-node/register --recursive --exit --no-parallel

docker rm -f qoq-redis
