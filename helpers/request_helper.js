var logger = require('winston');

var log = function(req, res, next){
  logger.info('Incoming request: ', req.originalUrl);
  next();
}

var check = function(req, res, next){
  var whitelistRegexp = /\/capture\/?\?([A-z0-9=&]|\n)*$/;

  if (whitelistRegexp.test(req.originalUrl)) {
    next();
  } else {
    res.status(400).render('error', {message: 'Request parameters are invalid'});
  }
}

module.exports = {
  log: log,
  check: check
}
