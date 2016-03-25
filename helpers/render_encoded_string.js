var webPage = require('webpage'),
    page = webPage.create(),
    cli_args = require('system').args;

page.viewportSize = {
    width: 1920,
    height: 1080
};

page.open(cli_args[1], function (status) {
  var base64 = page.renderBase64('PNG');
  console.log(base64);
  phantom.exit();
});
