#!/usr/bin/env sh

docker build -q -t imagine-dev .
docker run --rm imagine-dev mocha /src/tests --recursive
