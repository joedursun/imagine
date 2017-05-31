#! /usr/bin/env sh
docker build -t imagine-dev .
docker run -p 9090:80 imagine-dev
