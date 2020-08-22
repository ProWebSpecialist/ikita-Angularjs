var UserSchema = require('../schemas/user_schema.js');
var jwt = require('jsonwebtoken');
var jwtDecode = require('jwt-decode');

module.exports.getUsersByGroupId = function (req, res) {

    UserSchema.find({ 'groupid': req.params.groupid, 'usertype': 0 }, function (err, users) {

        if (err) {
            res.status(401).json(err);
        } else {
            res.status(201).json(users);
        }
    })
}

module.exports.getUserDataById = function (req, res) {

    UserSchema.findOne({ '_id': req.params.userid }, function (err, user) {

        if (err) {
            res.status(401).json(err);
        } else {
            res.status(201).json(user);
        }
    })
}

module.exports.getToken = function (req, res) {
    var token = req.params.token;
    if (token) {
        var decodedToken = jwtDecode(token);
        res.status(201).json(decodedToken);
    } else {
        res.json({ success: false, message: 'No Token provided' });
    }

}
