var router = require('express').Router(),
    log = require('winston'),
    screen = require('../helpers/screencap');

var acceptedFileTypes = ['pdf', 'png', 'jpg', 'gif', 'custom'];

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
