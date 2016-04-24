var webPage = require('webpage'),
    system = require('system'),
    base64 = require('./base64');

var page = webPage.create(),
    resource = system.args[1],
    fileName = system.args[2],
    width = system.args[3] || 1920,
    height = system.args[4] || 1080,
    pageTimeout = system.args[5] || 0;

page.viewportSize = {width: width, height: height };

page.open(base64.decode(resource), function (status){
  if (status !== 'success') {
    console.log('could not open ' + resource);
    phantom.exit(1);
  }

  window.setTimeout(function(){
    page.render(fileName);
    phantom.exit();
  }, pageTimeout);
});
