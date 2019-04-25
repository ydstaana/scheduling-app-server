var mongoose = require('mongoose');

var Request = require('./RequestSchema')
var RequestAssignment = require('./RequestAssignmentSchema')

var SwitchRequestSchema = new mongoose.Schema({
  oldAssignments : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment'
    }
  ],
  newAssignments : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RequestAssignment'
    }
  ]
});

var SwitchRequest = Request.discriminator('SwitchRequest', SwitchRequestSchema);

module.exports = SwitchRequest;