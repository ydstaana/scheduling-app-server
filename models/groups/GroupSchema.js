var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
  name: { type : String, required : true, unique : true},
  description: String,
  students : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  rotations : [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rotation'
    }
  ],
  isActive : Boolean
});

var Group = mongoose.model('Group', GroupSchema);

module.exports = Group;