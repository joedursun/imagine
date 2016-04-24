var router = require('express').Router();

router.get('/heartbeat', function (req, res) {
  res.status(200).send('ok!');
});

module.exports = router;
