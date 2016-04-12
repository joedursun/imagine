#! /usr/bin/env sh
docker build -t imagine-dev .
docker run -p 80:80 imagine-dev
