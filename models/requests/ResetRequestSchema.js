var mongoose = require('mongoose');

var RequestSchema = mongoose.Schema({
  email : { type : String, required : true},
  dateCreated : { type: Date , default : new Date()},
  isApproved: { type : Boolean, default : false},
  dateModified : Date
})

var Reset = mongoose.model('ResetRequest', RequestSchema);

module.exports = Reset;