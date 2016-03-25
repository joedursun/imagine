## About

"Imagine" is a web service that takes a given url and returns a screenshot in the desired format (e.g. png or pdf).

## Setup

First, install Docker. You can find platform specific instructions [here](https://docs.docker.com/engine/installation/).

To build and start up the app in a Docker container run: `./run.sh`

You'll now be able to access the app from your browser at `$DOCKER_HOST:8080`.

## Usage

Currently there is only one API endpoint: `/capture`

Below is a list of parameters along with their description:

|**parameter** | **description** |
| ------------ | --------------- |
| type         | the file type: png, pdf, jpg, and gif|
| format       | response format: file or string (base64 encoded; only for images)|
| resource     | url of the page to be screen capped |


## Examples

To get a base64 encoded image string: `curl $APP_HOST/capture?type=png&format=string&resource=https://github.com`

To get the same image as a file instead of an encoded string, just leave out the `format` parameter; `type=file` is the default.
