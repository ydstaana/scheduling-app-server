var mongoose = require('mongoose');

var User = require('./UserSchema.js');

var MedAdmin = User.discriminator('UST Medicine Admin',
  new mongoose.Schema()
 );

module.exports = MedAdmin;