var mongoose = require('mongoose');

var RequestSchema = mongoose.Schema({
  student : {
    type: mongoose.Schema.Types.ObjectId,
    required : true,
    ref: 'User'
  },
  dateCreated : { type: Date , default : new Date()},
  remarks : String,
  admin : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateModified : Date,
  isApproved: { type : Boolean, default : false},
  isPending: { type : Boolean, default : true},
  message : { type : String, minlength : 20 }
}, {
  discriminatorKey : "requestType"
})

var Request = mongoose.model('Request', RequestSchema);

module.exports = Request;