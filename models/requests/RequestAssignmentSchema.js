var mongoose = require('mongoose');

var RequestAssignmentSchema = mongoose.Schema({
  student : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rotation : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rotation'
  },
  group : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  field : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field'
  }
});

var RequestAssign = mongoose.model('RequestAssignment', RequestAssignmentSchema);

module.exports = RequestAssign;