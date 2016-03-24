var express = require('express'),
    app = express(),
    phantom = require('phantom'),
    PORT = 8080;

// stupid hack for Docker not exiting cleanly
process.on('SIGINT', function() {
  process.exit();
});

function screenCap(resourceLocation, resultType) {
  var result;
  phantom.create()
    .then(function (ph) {
      ph.createPage()
        .then(function(page){
          page.open(resourceLocation).then(function(status) {
            if(['png', 'jpg', 'jpeg', 'gif'].indexOf(resultType) > -1) {
              result = page.renderBase64(tmpFile);
            } else if(resultType === 'pdf') {
              result = page.render(resourceLocation);
            }
            phantom.exit();
          });
        });
      });
  return result;
}

app.get('/capture', function (req, res) {
  var resourceLocation = req.query.resource,
      resultType = req.query.type,
      result;
  result = screenCap(resourceLocation, resultType)
  res.send(result);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
