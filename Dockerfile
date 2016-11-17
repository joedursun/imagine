FROM ubuntu:14.04

RUN apt-get -y update && apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y libfontconfig nodejs

# Copy this separate from the app so Docker caches it
COPY package.json /src/package.json

# Install app dependencies
RUN cd /src && npm install

# Copy app source to container
COPY . /src

# Expose port 80
EXPOSE 80

ENV PATH /src/node_modules/phantomjs-prebuilt/lib/phantom/bin:/src/node_modules/mocha/bin:$PATH

# Start up the app
CMD ["node", "/src/app.js"]
