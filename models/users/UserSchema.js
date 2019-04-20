var mongoose = require('mongoose');
const moment = require('moment');

const baseOptions = {
  discriminatorKey: 'userType',
  collection: 'users'
};

var UserSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  address: String,
  mobileNumber: String,
  isActive:  Boolean,
  contactPersonName: String,
  contactPersonNumber: String,
  email: String,
  password: String,
  status: String,
  dateCreated : { type: Date, default : new Date() },
  lastModified: { type: Date, default : new Date() }
}, baseOptions);

UserSchema.statics.authenticate = function (email, password, callback) {
  this.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }

      if(user.isActive && user.password == password){
      	return callback(null, user);
      } else{
      	var err = new Error('Incorrect email/password');
        err.status = 401;
        return callback(err);
      }
      
    });
}

var User = mongoose.model('User', UserSchema)
module.exports = User;