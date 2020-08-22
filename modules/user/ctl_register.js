var UserSchema = require('../schemas/user_schema.js');
var bcrypt = require('bcryptjs');

module.exports.register = function (req, res) {
 
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    var standardPathimg = "assets/img/faces/face-0.jpg";

    var userInfo = {
        username:   req.body.username,
        password:   hash,
        first_name: req.body.first_name,
        last_name:  req.body.last_name,
        address:    req.body.address,
        plz:        req.body.plz,
        ort:        req.body.ort,
        birth_date: req.body.birth_date,
        telefon:    req.body.telefon || null,
        description: null,
        email :     req.body.email || null,
        usertype:   req.body.usertype,
        profilPathImg : standardPathimg,
        kitaid:     req.body.kitaid,
        groupid:    req.body.groupid
    }
    
    UserSchema.create(userInfo, function(err, doc){
        if(err){
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })
    
   
}

  
module.exports.checkUsername = function (req, res) {
    
   
    UserSchema.findOne({ 'username': req.params.username}, function(err, user){
       
        if(err){
            res.status(401).json(err);
        }else{
            res.status(201).json(user);
        }
      
    })
}

