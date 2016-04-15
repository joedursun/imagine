var express = require('express');
var routes = require('./routes/index');
var app = express();
var log = require('winston');

var logRequest = function(req, res, next){
  log.info('Incoming request: ', req.originalUrl);
  next();
}

app.set('view engine', 'ejs');

app.all('*', logRequest);
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
