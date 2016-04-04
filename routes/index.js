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

function screenCap(params, response) {
  var handler;
  handler = (params.format === 'string') ? screenCapToEncodedString : screenCapToFile;
  handler(params, response);
}

function screenCapToEncodedString(params, response) {
  var resultType = params.type,
      resource = params.resource,
      responseFormat = params.format || 'file',
      width = params.w || 1920,
      height = params.h || 1080,
      cmd;

  cmd = ['phantomjs /src/helpers/render_string.js', resource, width, height].join(' ');

  childProcess.exec(cmd, function(error, stdout, stderr){
    response.send(stdout);
  });
}

function screenCapToFile(params, response) {
  var resultType = params.type,
      resource = params.resource,
      responseFormat = params.format || 'file',
      width = params.w || 1920,
      height = params.h || 1080;

  tmp.file(function tmpFileCreated(err, path, fd, cleanupCallback){
    if (err) throw err;
    var cmd,
        fileName = path.split('.')[0] + '.' + resultType;

    cmd = ['phantomjs /src/helpers/render_file.js', resource, fileName, width, height].join(' ');

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
  screenCap(req.query, res);
});

module.exports = router;
