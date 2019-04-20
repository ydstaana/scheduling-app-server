var mongoose = require('mongoose');

var User = require('../users/UserSchema.js');

var Student = User.discriminator('Student',
  new mongoose.Schema({
    field: String
  })
 );

 module.exports = Student;