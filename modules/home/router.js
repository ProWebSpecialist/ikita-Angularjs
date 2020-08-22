var express = require('express');
var router = express.Router();
var _read = require('./ctl_login.js');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// Login
router.post('/login', _read.login);

module.exports = router;