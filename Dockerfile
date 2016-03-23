FROM ubuntu:14.04
RUN apt-get -y update && apt-get install -y nodejs nodejs-legacy npm

# Copy this separate from the app so Docker caches it
COPY package.json /src/package.json

# Install app dependencies
RUN cd /src && npm install --production

# Copy app source to container
COPY . /src

# Expose port 8080
EXPOSE 8080

# Start up the app
CMD ["node", "/src/index.js"]
