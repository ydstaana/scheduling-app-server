var mongoose = require('mongoose');

var FieldGroupSchema = new mongoose.Schema({
  name: { type : String, required : true},
  fields : [
    {
      type: mongoose.Schema.Types.ObjectId,
      required : true,
      ref: 'Field'
    }
  ],
  isActive : Boolean
}, {
  discriminatorKey : 'fieldGroupType'
});

var FieldGroup = mongoose.model('FieldGroup', FieldGroupSchema);

module.exports = FieldGroup;
