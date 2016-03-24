FROM ubuntu:14.04

RUN apt-get -y update && apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN apt-get install -y libfontconfig nodejs

# Copy this separate from the app so Docker caches it
COPY package.json /src/package.json

# Install app dependencies
RUN cd /src && npm install --production

# Copy app source to container
COPY . /src

# Expose port 8080
EXPOSE 8080

ENV PATH /src/node_modules/phantomjs-prebuilt/lib/phantom/bin:$PATH

# Start up the app
CMD ["node", "/src/index.js"]
