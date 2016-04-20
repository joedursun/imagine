var express = require('express'),
    log = require('winston'),
    screen = require('../helpers/screencap');

var router = express.Router(),
    PORT = 80;

var acceptedFileTypes = ['pdf', 'png', 'jpg', 'gif'];

router.get('/heartbeat', function (req, res) {
  res.status(200).send('ok!');
});

router.get('/capture', function (req, res) {
  if (acceptedFileTypes.indexOf(req.query.type) > -1) {
    screen.capture(req.query, res);
  } else {
    var msg = 'Invalid type param: ' + req.query.type,
        responseStatus = 400;
    log.info(msg);
    res.status(responseStatus).send(msg);
  }
});

module.exports = router;
