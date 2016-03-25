var express = require('express'),
    tmp = require('tmp'),
    phantom = require('phantom'),
    fs = require('fs'),
    childProcess = require('child_process');

var app = express(),
    PORT = 8080;

// stupid hack for Docker not exiting cleanly
process.on('SIGINT', function() {
  process.exit();
});

function screenCap(resourceLocation, resultType, response, responseFormat) {
  if(responseFormat === 'string'){
    screenCapToEncodedString(resourceLocation, response);
  } else {
    screenCapToFile(resourceLocation, resultType, response);
  }
}

function screenCapToEncodedString(resourceLocation, response) {
  var cmd = 'phantomjs /src/render_encoded_string.js ' + resourceLocation;

  childProcess.exec(cmd, function(error, stdout, stderr){
    response.send(stdout);
  });
}

function screenCapToFile(resourceLocation, resultType, response) {
  tmp.file(function tmpFileCreated(err, path, fd, cleanupCallback){
    if (err) throw err;
    var cmd,
        fileName = path.split('.')[0] + '.' + resultType;

    cmd = 'phantomjs /src/render_file.js "' + resourceLocation + '" ' + fileName;

    childProcess.exec(cmd, function(err, stdout, stderr){
      response.sendFile(fileName, function (err){
        if (err) {
          console.log(err);
          response.status(err.status).end();
        }
        fs.unlink(fileName, function(err){
          if (err) throw err;
        });
      });
    });
  });
}

app.get('/capture', function (req, res) {
  var resourceLocation = req.query.resource,
      resultType = req.query.type,
      responseFormat = req.query.format || 'file';

  screenCap(resourceLocation, resultType, res, responseFormat);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
