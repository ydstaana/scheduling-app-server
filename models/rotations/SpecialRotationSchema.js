var Rotation = require('./RotationSchema.js');
var mongoose = require('mongoose');

var SpecialRotation = Rotation.discriminator('Special', 
  new mongoose.Schema({
    fieldGroup : {
      type: mongoose.Schema.Types.ObjectId,
      required : true,
      ref: 'FieldGroup'
    },
  })
);

module.exports = SpecialRotation;