// user model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  username: String,
  password: String,
  name: String,
  company: String,
  designation: String,
  department: String,
  phone: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordRegisterToken: String,
  passwordRegisterExpires: Date,
  admin: Boolean
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);