var mongoose = require('mongoose');

var FieldGroup = require('./FieldGroupSchema.js');

var StandardGroup = FieldGroup.discriminator('Standard Group',
  new mongoose.Schema()
 );

module.exports = StandardGroup;