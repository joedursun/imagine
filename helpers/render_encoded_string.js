var webPage = require('webpage'),
    page = webPage.create(),
    args = require('system').args;

var page = webPage.create(),
    resource = args[1],
    fileName = args[2],
    width = args[3] || 1920,
    height = args[4] || 1080;

page.viewportSize = { width: width, height: height };

page.open(cli_args[1], function (status) {
  var base64 = page.renderBase64('PNG');
  console.log(base64);
  phantom.exit();
});
