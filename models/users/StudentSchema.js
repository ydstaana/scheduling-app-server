var mongoose = require('mongoose');

var User = require('./UserSchema.js');

var Student = User.discriminator('Student',
  new mongoose.Schema({
    studentId: {type : String, required : true, minlength : 10},
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    },
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Field'
    },
    assignments : [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
      }
    ]
  })
 );

 module.exports = Student;