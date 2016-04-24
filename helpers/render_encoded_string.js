var webPage = require('webpage'),
    base64 = require('./base64').base64,
    args = require('system').args;

var page = webPage.create(),
    resource = args[1],
    fileName = args[2],
    width = args[3] || 1920,
    height = args[4] || 1080;

page.viewportSize = { width: width, height: height };

page.open(base64.decode(resource), function (status) {
  var encodedImg = page.renderBase64('PNG');
  console.log(encodedImg);
  phantom.exit();
});
