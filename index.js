var express = require('express'),
    app = express(),
    phantom = require('phantom'),
    exec = require('child_process').exec,
    PORT = 8080;

// stupid hack for Docker not exiting cleanly
process.on('SIGINT', function() {
  process.exit();
});

function screenCap(resourceLocation, resultType, callback) {
  var result, screenCapScript, cmd;

  if(resultType === 'pdf') {
    screenCapScript = '/src/pdf.js';
  } else if(['png', 'jpg', 'jpeg', 'gif'].indexOf(resultType) > -1) {
    screenCapScript = '/src/image.js';
  }

  cmd = 'phantomjs ' + screenCapScript + ' ' + resourceLocation;
  exec(cmd, function(error, stdout, stderr){
    callback(stdout);
  });
}

app.get('/capture', function (req, res) {
  var resourceLocation = req.query.resource,
      resultType = req.query.type;
  screenCap(resourceLocation, resultType, function(base64img){
    res.send(base64img);
  });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
