var mongoose = require('mongoose');

var Assignment = mongoose.Schema({
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
  }
})

module.exports = Assignment;