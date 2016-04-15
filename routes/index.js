var express = require('express'),
    tmp = require('tmp'),
    fs = require('fs'),
    childProcess = require('child_process'),
    log = require('winston');

var router = express.Router(),
    PORT = 80;

var acceptedFileTypes = ['pdf', 'png', 'jpg', 'gif'];

// stupid hack for Docker not exiting cleanly
process.on('SIGINT', function() {
  process.exit();
});

function screenCap(params, response) {
  var handler;
  handler = (params.format === 'string') ? screenCapToEncodedString : screenCapToFile;
  try{
    handler(params, response);
  } catch (e) {
    winston.info(e);
    response.status(500).send('Something went wrong.');
  }
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
    if (err) {
      log.info(err);
      return;
    }
    var cmd,
        fileName = path.split('.')[0] + '.' + resultType;

    cmd = ['phantomjs /src/helpers/render_file.js', resource, fileName, width, height].join(' ');

    childProcess.exec(cmd, function(err, stdout, stderr){
      response.sendFile(fileName, function (err){
        if (err) {
          log.info(err);
          return;
        }
        fs.unlink(fileName, function(err){
          if (err) { log.info(err); return; }
        });
      });
    });
  });
}

router.get('/capture', function (req, res) {
  if (acceptedFileTypes.indexOf(req.query.type) > -1) {
    screenCap(req.query, res);
  } else {
    var msg = 'Invalid type param: ' + req.query.type,
        responseStatus = 400;
    log.info(msg);
    res.status(responseStatus).send(msg);
  }
});

module.exports = router;
