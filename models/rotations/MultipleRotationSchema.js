var Rotation = require('./RotationSchema.js');
var mongoose = require('mongoose');

var MultipleRotation = Rotation.discriminator('Multiple', 
  new mongoose.Schema({
    fieldGroup : {
      type: mongoose.Schema.Types.ObjectId,
      required : true,
      ref: 'FieldGroup'
    },
  })
);

module.exports = MultipleRotation;