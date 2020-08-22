var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');

autoIncrement.initialize(mongoose.connection);

var userSchema = new Schema({
  username:  {
      type: String,
      required : true,
      unique: true
  },
  password: {
      type: String,
      required : true
  },
  first_name: {
    type: String,
    required : true,
  },
  last_name: {
    type: String,
    required : true,
  },
  address: {
      type: String,
      required : true,
  },
  plz: {
    type: Number,
    required : true,
 },
  ort: {
    type: String,
    required : true,
 },
  birth_date: {
    type: Date,
    required : true
  },
  telefon: Number,
  description: String,
  email: String,
  usertype:   Number,
  profilPathImg: String,
  kitaid:   {
    type: Number,
    required : true,
 },
  groupid: {
    type: Number,
    required : true,
 }
});

userSchema.plugin(autoIncrement.plugin, 'User');
userSchema.plugin(passportLocalMongoose);

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    userid: this._id,
    username: this.username,
    name: this.name,
    usertype: this.usertype,
    profilPathImg : this.profilPathImg,
    kitaid: this.kitaid,
    kitaname: null,
    groupid: this.groupid,
    groupname : null,
    exp: parseInt(expiry.getTime() / 1000),
  }, "bAKVdqczerYAYKdMxsaBzbFUJU6ZvL2LwZuxhtpS");
};

module.exports = mongoose.model('User', userSchema);