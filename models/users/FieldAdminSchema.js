var mongoose = require('mongoose');

var User = require('./UserSchema.js');

var FieldAdmin = User.discriminator('Field Admin',
  new mongoose.Schema({
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Field'
    }
  })
 );

 module.exports = FieldAdmin;