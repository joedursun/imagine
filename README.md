## About

"Imagine" is a web service that takes a given url and returns a screenshot in the desired format (e.g. png or pdf).

## Setup

First, install Docker. You can find platform specific instructions [here](https://docs.docker.com/engine/installation/).

Next you'll want to build the Docker image: `docker build -t imagine-dev .`
Note: it will likely take a long time to build. PhantomJS takes a loooooong time to compile (up to an hour).
