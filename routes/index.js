var express = require('express'),
    tmp = require('tmp'),
    fs = require('fs'),
    childProcess = require('child_process');

var router = express.Router(),
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
  var cmd = 'phantomjs /src/helpers/render_encoded_string.js ' + resourceLocation;

  childProcess.exec(cmd, function(error, stdout, stderr){
    response.send(stdout);
  });
}

function screenCapToFile(resourceLocation, resultType, response) {
  tmp.file(function tmpFileCreated(err, path, fd, cleanupCallback){
    if (err) throw err;
    var cmd,
        fileName = path.split('.')[0] + '.' + resultType;

    cmd = 'phantomjs /src/helpers/render_file.js "' + resourceLocation + '" ' + fileName;

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

router.get('/capture', function (req, res) {
  var resourceLocation = req.query.resource,
      resultType = req.query.type,
      responseFormat = req.query.format || 'file';

  screenCap(resourceLocation, resultType, res, responseFormat);
});

module.exports = router;
