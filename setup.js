var fs = require('fs');
var request = require('request');
var yaml = require('js-yaml');
var childProcess = require('child_process');
var log = require('winston');

var appData = yaml.safeLoad(fs.readFileSync('/src/config/app_data.yml'));
var customjs = appData.customjs;

var retrievePlugins = function(){
  var cmd = 'curl -Lo /src/plugins/custom.js ' + customjs;

  childProcess.execSync(cmd);
}

var run = function(){
  retrievePlugins();
}

module.exports = {
  run: run
}
