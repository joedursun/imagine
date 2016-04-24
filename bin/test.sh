#!/usr/bin/env sh

docker build -t imagine-dev .
docker run --rm imagine-dev mocha /src/tests --recursive
