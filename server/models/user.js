// user model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
  username: {unique: true, type: String, required: true },
  password: String,
  name: String,
  company: String,
  designation: String,
  department: String,
  phone: String,
  landline: String,
  companyAddress: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordRegisterToken: String,
  passwordRegisterExpires: Date,
  admin: Boolean
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);