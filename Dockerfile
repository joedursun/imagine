FROM ubuntu:14.04
RUN apt-get -y update && apt-get install -y nodejs nodejs-legacy npm \
      build-essential g++ flex bison gperf ruby perl \
      libsqlite3-dev libfontconfig1-dev libicu-dev libfreetype6 libssl-dev \
      libpng-dev libjpeg-dev python libx11-dev libxext-dev git

ENV PHANTOM_JS_TAG=2.1.1

RUN git clone git://github.com/ariya/phantomjs.git /tmp/phantomjs && \
    cd /tmp/phantomjs && git checkout $PHANTOM_JS_TAG && \
    git submodule init && git submodule update && python build.py &&\
    rm -rf /tmp/phantomjs

# Copy app source to container
COPY . /src

# Install app dependencies
RUN cd /src && npm install --production

# Expose port 8080
EXPOSE 8080

# Start up the app
CMD ["node", "/src/index.js"]
