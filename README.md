## About

"Imagine" is a web service that takes a given url and returns a screenshot in the desired format (e.g. png or pdf).

## Setup

First, install Docker. You can find platform specific instructions [here](https://docs.docker.com/engine/installation/).

To build and start up the app in a Docker container run: `./run.sh`

You'll now be able to access the app from your browser at `$APP_HOST:80`.

## Usage

Currently there is only one API endpoint: `/capture`

Below is a list of parameters along with their description:

|**parameter** | **description** |
| ------------ | --------------- |
| type         | the file type: png, pdf, jpg, and gif |
| format       | response format: file or string (base64 encoded; only for images) |
| resource     | url of the page to be screen capped |
| w            | viewport width to be passed to phantomjs |
| h            | viewport height to be passed to phantomjs |


## Examples

To get a base64 encoded image string:
```bash
curl $APP_HOST/capture?type=png&format=string&resource=https://github.com
```

To get the same image as a file instead of an encoded string, just leave out the `format` parameter; `type=file` is the default.

## Troubleshooting

### Logs

To inspect the logs of a running container (e.g. a container running the `imagine-dev` image): `docker logs imagine-dev`

### Interacting with the container

Sometimes it's useful to start an interactive session with your container: `docker run --rm -i imagine-dev /bin/bash`

In the above example you will likely not see any output until you enter a command (e.g. `pwd`).


### Health Check

If you want to check if the app is up without requesting a screenshot, you can visit `$APP_HOST/heartbeat`.
The "heartbeat" route returns "ok!" with a 200 response code and does not log the request (useful if you've got a monitoring
service checking the app and don't want to fill your disk with logs).
