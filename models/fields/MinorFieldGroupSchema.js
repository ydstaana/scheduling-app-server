var mongoose = require('mongoose');

var FieldGroup = require('./FieldGroupSchema.js');

var MinorGroup = FieldGroup.discriminator('Minor Group',
  new mongoose.Schema()
 );

module.exports = MinorGroup;