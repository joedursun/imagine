var express = require('express');
var routes = require('./routes/index');
var requestHelper = require('./helpers/request_helper');
var app = express();
var log = require('winston');

// stupid hack for Docker not exiting cleanly
process.on('SIGINT', function() {
  process.exit();
});

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.all('/capture*', requestHelper.log, requestHelper.check, requestHelper.verifySignature);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(80, function() {
  log.info('Listening on port 80!');
});

module.exports = app;
