#!/usr/bin/env bash

docker pull redis:${1:-4}-alpine
docker run -it -p 7698:6379 -d --name qoq-redis redis --requirepass 123456

jest --runInBand
code=$?

docker rm -f qoq-redis

exit $code
