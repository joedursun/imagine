var log = require('winston'),
    childProcess = require('child_process'),
    fs = require('fs'),
    tmp = require('tmp');

var capture = function(params, response) {
  var handler;
  handler = (params.format === 'string') ? screenCapToEncodedString : screenCapToFile;
  try{
    handler(params, response);
  } catch (e) {
    log.info(e);
    response.status(500).send('Something went wrong.');
  }
}

var screenCapToEncodedString = function(params, response) {
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

var screenCapToFile = function(params, response) {
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

module.exports = {
  capture: capture
}
