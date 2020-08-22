var jwt = require('jsonwebtoken');

module.exports.tokenCheck = function (req, res, next) {

    var token = req.headers.auth;
    if(token){
        jwt.verify(token, 'bAKVdqczerYAYKdMxsaBzbFUJU6ZvL2LwZuxhtpS', function(err, decoded) {
            if(err){
                res.status(401).json({"message": "failed"});
            }else{
                req.username = decoded.username;
                req.name = decoded.name;
                next();
            }
        });
    }else{
        res.status(403).json({"message": "failed"});
    }
   

}