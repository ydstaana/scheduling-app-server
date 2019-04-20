var mongoose = require('mongoose');

var Field = require('./FieldSchema.js');

var ElectiveField = Field.discriminator('Elective',
  new mongoose.Schema({
    fieldGroup : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FieldGroup'
    }
  })
 );

module.exports = ElectiveField;