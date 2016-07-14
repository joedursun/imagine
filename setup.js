var fs = require('fs');
var request = require('request');
var yaml = require('js-yaml');
var childProcess = require('child_process');
var log = require('winston');

var appData = yaml.safeLoad(fs.readFileSync('/src/config/app_data.yml'));
var customjs = appData.customjs;

var retrievePlugins = function(){
  var file = fs.createWriteStream("/src/plugins/custom.js");
  var sentRequest = request.get(customjs);

  sentRequest.on('response', function(response){
    if (response.statusCode !== 200) {
      log.info('Plugin request failed with error code: ', response.statusCode);
      return false;
    }
  });

  sentRequest.on('error', function(err){
    log.info(err);
    return false;
  });

  sentRequest.pipe(file);

  file.on('finish', function(){
    file.close();
  });

}

var run = function(){
  retrievePlugins();
}

module.exports = {
  run: run
}
