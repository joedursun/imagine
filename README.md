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

## Deployment

Since Imagine is already containerized, it's easy to deploy with Kubernetes. Make sure to have [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed and configured before moving on.
You'll also want to have a running kubernetes cluster. Locally you can use [minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/).
Google Kubernetes Engine and Azure provide seemless setup of Kubernetes clusters and AWS is currently in preview.

There's a simple, quick-start kubernetes deployment.yaml file provided in this repo to work as a starting point (referencing a public image).
For production purposes you'll want to use an image from a private Docker registry to avoid sharing your app secret.

Once you have a running kubernetes cluster and set your kubectl current-context appropriately just run `kubectl apply -f deployment.yaml`
Be sure to update the reference to your custom image if you're running this in production.

The provided deployment.yaml file assumes you've got at least 1 vCPU available in your cluster and at least  512 MB of available memory (change if necessary).

Use `kubectl describe service imagine-service` to display information about the newly deployed service (including external IP if you didn't provide one).


## Usage

Currently there are two routes that are available: `/capture` and `/heartbeat`. The heartbeat route is covered in the
"Health Check" section below, and the capture route is covered in the following table:


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

Assuming your app secret is `secret!` and you want to screenshot `https://github.com/LightshedHealth/imagine` then:

```ruby
# Example of creating signature in Ruby
require 'base64'
require 'digest'

app_secret = ENV['IMAGINE_APP_SECRET'] # => 'secret!'
url = 'https://github.com/LightshedHealth/imagine'
encoded_url = Base64.strict_encode64(url) # => 'aHR0cHM6Ly9naXRodWIuY29tL0xpZ2h0c2hlZEhlYWx0aC9pbWFnaW5l'
signature = Digest::SHA256.base64digest(encoded_url + app_secret) # => 'AyMK86hre66wous/C5KD2EOYK2+WHk8beSguu4lg0Jg='
```

To get a png image visit the following url in your browser:
`$APP_HOST/capture?type=png&resource=aHR0cHM6Ly9naXRodWIuY29tL0xpZ2h0c2hlZEhlYWx0aC9pbWFnaW5l&signature=AyMK86hre66wous/C5KD2EOYK2+WHk8beSguu4lg0Jg=`

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
