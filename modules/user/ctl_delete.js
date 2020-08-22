var UserSchema = require('../schemas/user_schema.js');

module.exports.delete = function (req, res) {

    UserSchema.findOne({'username': req.params.username}, function (err, doc) {
        if (err) {
            res.status(401).json({ message: 'Error user find' });
        }else{
            if (doc == null) {
                console.log(req.params.username);
                res.status(401).json({ message: 'null error' , doc: doc});
            }else{
                doc.remove(function (err, doc) {
                    if (err)  res.status(401).json({ message: 'Error deleted' });
                });
                res.status(201).json({ message: 'Successfully deleted' });
            }
        }
    })
}