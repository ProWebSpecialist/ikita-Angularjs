var express = require('express');
var router = express.Router();
var _create = require('./ctl_register.js');
var _update = require('./ctl_edit.js');
var _remove = require('./ctl_delete.js');
var _getUser = require('./ctl_getUser.js');
var _tokenCheck = require('../../config/auth_token.js');
var _admin = require('./ctl_adminuser.js');
var _allusers = require('./ctl_getalluser.js');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  //console.log('Time: ', Date.now());
  next();
});

// Check Username
router.get('/register/:username', _create.checkUsername);

// Get Users By GroupId
router.get('/getUsersByGroup/:groupid', _getUser.getUsersByGroupId);

// Get User By Id
router.get('/getUserDataById/:userid', _getUser.getUserDataById);

// Register
router.post('/register', _create.register);

// Edit
router.put('/edit', _update.edit);

// Edit Passwort
router.put('/editPw', _update.editPw);

// Delete
router.get('/delete/:username', _remove.delete);

// Edit Profil Img
router.put('/edit/profilImage', _update.editProfilImg);

// Get Token
router.get('/getToken/:token', _getUser.getToken);

//router.get('/status', _getUser.getUserStatus);

// Get Admin Info
router.get('/getAdminData', _admin.adminUser);

// Get all admin info using same kitaID
router.post('/getAllAdminData', _admin.allAdmin);

// Get all users info using same KitaID
router.post('/getAllUsersData', _allusers.getAllUsersData);

// Get All Users
router.get('/getAllUsers', _allusers.getAllUsers);

module.exports = router;