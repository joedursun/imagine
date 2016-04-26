[![Code Climate](https://codeclimate.com/github/LightshedHealth/imagine/badges/gpa.svg)](https://codeclimate.com/github/LightshedHealth/imagine)
[![Dependency Status](https://david-dm.org/LightshedHealth/imagine.svg)](https://david-dm.org/LightshedHealth/imagine)

## About

"Imagine" is a web service that takes a given url and returns a screenshot in the desired format (e.g. png or pdf).

## Setup

First, install Docker. You can find platform specific instructions [here](https://docs.docker.com/engine/installation/).

To build and start up the app in a Docker container run: `./bin/run.sh`

You'll now be able to access the app from your browser at `$APP_HOST:80`.

### Tests

Included in the `bin` directory is a script to run the test suite in Docker: `./bin/test.sh`

The test script will rebuild the Docker image before running the suite so the tests should always represent current code.
Sometimes npm does not install packages successfully causing a failed build, but this can be dealt with by re-running
the Docker build command (or the appropriate script if you're using them).

## Usage

Below is a list of parameters along with their description:

|**parameter** | **description** | **default** |
| ------------ | --------------- | ----------- |
| type         | the file type: png, pdf, jpg, and gif | none |
| format       | response format: file or string (base64 encoded; only for images) | file |
| resource     | base64 encoded url of the page to be screen capped | none |
| w            | viewport width to be passed to phantomjs | 1920 |
| h            | viewport height to be passed to phantomjs | 1080 |
| wait         | number of milliseconds to wait after page load before taking screenshot | 0 |
| signature    | base64 encoded SHA256 digest of resource param + app secret | none |

Note: the resource param mentioned above must be base64 encoded to prevent issues with the url.

The signature param is the base64 encoded SHA256 digest of the resource param + the app secret (in that order!)
defined in config/app_data.yml. This signature is a way of disallowing service to untrusted traffic. In the event that
a request comes in with a bad signature, a 403 status is returned along with the message "Invalid signature."

## Examples

To get a base64 encoded image string:
```bash
curl $APP_HOST/capture?type=png&format=string&resource=aHR0cDovL3JlZGRpdC5jb20vP2Zvbz1iYXI
```

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
