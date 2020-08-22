var express = require('express');
var router = express.Router();
var _kita = require('./ctl_kita.js');
var jwt = require('express-jwt');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// KitaId suchen
router.get('/searchId/:kitaid', _kita.findObjKita);

// Kita registrieren
router.post('/register', _kita.registerKita);

// Kita editieren
router.put('/editKita', _kita.editKita);

module.exports = router;