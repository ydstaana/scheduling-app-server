var mongoose = require('mongoose');

var AssignmentSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rotation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rotation'
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  field : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field'
  },
  grade : Number,
  remarks: String,
  admin : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isCompleted: { type : Boolean, default : false },
  isCustom: { type : Boolean, default : false },
  isApproved: { type : Boolean, default : false },
  isActive: { type : Boolean, default : true }
})

var Assignment = mongoose.model('Assignment', AssignmentSchema);

module.exports = Assignment;