var webPage = require('webpage'),
    system = require('system'),
    decode = require('./decode');

var page = webPage.create(),
    resource = system.args[1],
    fileName = system.args[2],
    width = system.args[3] || 1920,
    height = system.args[4] || 1080;

page.viewportSize = {width: width, height: height };

page.open(decode.decode64(resource), function (status){
  if (status !== 'success') {
    console.log('could not open ' + resource);
    phantom.exit(1);
  }

  page.render(fileName);
  phantom.exit();
});
