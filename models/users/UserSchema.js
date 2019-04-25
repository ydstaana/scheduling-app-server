var mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const baseOptions = {
  discriminatorKey: 'userType',
  collection: 'users'
};

var UserSchema = new mongoose.Schema({
  firstName: { type: String, required : true},
  middleName: { type: String, required : true},
  lastName: { type: String, required : true},
  address: String,
  mobileNumber: String,
  isActive:  Boolean,
  contactPersonName: String,
  contactPersonNumber: String,
  email: { type: String, required : true, unique: true},
  password: String,
  status: String,
  dateCreated : { type: Date, default : new Date() },
  lastModified: { type: Date, default : new Date() }
}, baseOptions);

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

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

      user.comparePassword(password, function(err, isMatch) {
          if (err) throw err;

          if(isMatch)
            return callback(null, user);
          else {
            var err = new Error('Incorrect email/password');
            err.status = 401;
            return callback(err);
          }
      });
    });
}

UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
});

var User = mongoose.model('User', UserSchema)
module.exports = User;