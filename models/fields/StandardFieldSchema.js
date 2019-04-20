var mongoose = require('mongoose');

var Field = require('./FieldSchema.js');

var SingleField = Field.discriminator('Standard',
  new mongoose.Schema()
 );

module.exports = SingleField;