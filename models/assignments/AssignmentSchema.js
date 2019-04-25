var mongoose = require('mongoose');

var AssignmentSchema = mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref: 'User'
  },
  rotation: {
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref: 'Rotation'
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref: 'Group'
  },
  field : {
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref: 'Field'
  },
  grade : Number,
  remarks: String,
  admin : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message : String,
  isCompleted: { type : Boolean, default : false },
  isCustom: { type : Boolean, default : false },
  isApproved: { type : Boolean, default : false },
  isActive: { type : Boolean, default : true }
})

var Assignment = mongoose.model('Assignment', AssignmentSchema);

module.exports = Assignment;