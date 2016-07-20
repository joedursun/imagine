var log = require('winston'),
    childProcess = require('child_process'),
    fs = require('fs'),
    tmp = require('tmp');

var capture = function(params, response) {
  var handler;
  switch (params.format) {
    case 'string':
      handler = screenCapToEncodedString;
      break;
    case 'custom':
      handler = customScreenCapScript;
      break;
    default:
      handler = screenCapToFile;
  }

  try{
    handler(params, response);
  } catch (e) {
    log.info(e);
    response.status(500).send('Something went wrong.');
  }
}

var customScreenCapScript = function(params, response) {
  tmp.file(function tmpFileCreated(err, path, fd, cleanupCallback){
    if (err) {
      log.info(err);
      return;
    }

    var resultType = params.type,
        resource = params.resource,
        width = Number(params.w) || 1920,
        height = Number(params.h) || 1080,
        wait = Number(params.wait) || 250;

    var cmd, fileName, stringParams;

    fileName = path.split('.')[0] + '.' + resultType;
    cmd = ['phantomjs /src/plugins/custom.js', resource, fileName, width, height, wait].join(' ');

    childProcess.exec(cmd, function(err, stdout, stderr){
      if (stderr) log.info(stderr);
      if (err) {
        log.error('Error: ', err);
        response.send('Error occurred.');
        return;
      }

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

var screenCapToEncodedString = function(params, response) {
  var resource = params.resource,
      width = Number(params.w) || 1920,
      height = Number(params.h) || 1080,
      cmd;

  cmd = ['phantomjs /src/helpers/render_encoded_string.js', resource, width, height].join(' ');

  childProcess.exec(cmd, function(error, stdout, stderr){
    response.send(stdout);
  });
}

var screenCapToFile = function(params, response) {
  var resultType = params.type,
      resource = params.resource,
      width = Number(params.w) || 1920,
      height = Number(params.h) || 1080,
      pageTimeout = Number(params.wait) || 0;

  tmp.file(function tmpFileCreated(err, path, fd, cleanupCallback){
    if (err) {
      log.info(err);
      return;
    }

    var cmd, fileName;

    fileName = path.split('.')[0] + '.' + resultType;
    cmd = ['phantomjs /src/helpers/render_file.js', resource, fileName, width, height, pageTimeout].join(' ');

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
