var mongoose = require('mongoose');

const baseOptions = {
  discriminatorKey: 'rotationType'
};

var RotationSchema = mongoose.Schema({
  schedule : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule'
  },
  group : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  isActive: Boolean
}, baseOptions)

var Rotation = mongoose.model('Rotation', RotationSchema);

module.exports = Rotation;