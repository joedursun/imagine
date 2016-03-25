var webPage = require('webpage'),
    system = require('system');

var page = webPage.create(),
    resource = system.args[1],
    fileName = system.args[2];

page.open(resource, function (status){
  if (status !== 'success') {
    console.log('could not open ' + resource);
    phantom.exit(1);
  }

  page.render(fileName);
  phantom.exit();
});
