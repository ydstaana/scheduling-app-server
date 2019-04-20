var mongoose = require('mongoose');

var FieldGroup = require('./FieldGroupSchema.js');

var ElectiveGroup = FieldGroup.discriminator('Elective Group',
  new mongoose.Schema()
 );

module.exports = ElectiveGroup;