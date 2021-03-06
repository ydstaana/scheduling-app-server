var mongoose = require('mongoose');

const baseOptions = {
  discriminatorKey: 'fieldType',
  collection: 'fields'
}

var FieldSchema = new mongoose.Schema({
  name: { type : String, required : true, unique : true},
  admin : 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  isActive : Boolean,
  address: String
}, baseOptions);

var Field = mongoose.model('Field', FieldSchema);

module.exports = Field;