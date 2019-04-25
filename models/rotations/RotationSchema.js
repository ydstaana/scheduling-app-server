var mongoose = require('mongoose');

const baseOptions = {
  discriminatorKey: 'rotationType'
};

var RotationType = {
  SINGLE: "Single",
  MULTIPLE: "Multiple",
  SPECIAL : "Special"
}

var RotationSchema = mongoose.Schema({
  studentCount : Number,
  schedule : {
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref: 'Schedule'
  },
  group : {
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref: 'Group'
  },
  isActive: Boolean
}, baseOptions)

RotationSchema.pre('validate', async function(next) {
  switch(this.rotationType) {
    case RotationType.SINGLE:
      var rot = await Rotation.findOne({
        field : this.field,
        schedule : this.schedule
      })
      if(rot) {
        next(new Error("Rotation already exists"))
      }
      else 
        next();
      break;
    default:
      var rot = await Rotation.findOne({
        fieldGroup : this.fieldGroup,
        schedule : this.schedule
      })
      if(rot) {
        next(new Error("Rotation already exists"))
      }
      else 
        next();
      break;
  }
})

var Rotation = mongoose.model('Rotation', RotationSchema);

module.exports = Rotation;