var Request = require('../../models/requests/RequestSchema')
var SwitchRequest = require('../../models/requests/SwitchRequestSchema')
var Assignment = require('../../models/assignments/AssignmentSchema.js')
var ElectiveRequest = require('../../models/requests/ElectiveRequestSchema')

var RequestTypes = {
  SWITCH : "SwitchRequest",
  ELECTIVE: "ElectiveRequest"
}

function createRequest(req, res) {
  switch(req.body.requestType) {
    case RequestTypes.SWITCH :
      SwitchRequest.create(req.body, function(err, request) {
        if(err)
          res.status(422).json({code:'422',message:err});
        else
          res.status(200).send(request);
      })
      break;
    case RequestTypes.ELECTIVE :
      ElectiveRequest.create(req.body, function(err, request) {
        if(err)
          res.status(422).json({code:'422',message:err});
        else
          res.status(200).send(request);
      });
      break;
  }
}

function listSwitchRequests(req, res) {
  SwitchRequest.find({})
  .populate('student')
  .populate('admin')
  .populate('oldRotation')
  .populate({
    path : 'oldRotation',
    populate : { path : 'field'}
  })
  .populate('newRotation')
  .populate({
    path : 'newRotation',
    populate : { path : 'field'}
  })
  .exec(function(err, requests) {
    if(err)
      res.status(422).json({code:'422',message:err});
    else
      res.status(200).send(requests);
  })
}

function listElectiveRequests(req, res) {
  ElectiveRequest.find({})
  .populate('student')
  .populate('admin')
  .exec(function(err, requests) {
    if(err)
      res.status(422).json({code:'422',message:err});
    else
      res.status(200).send(requests);
  });
}

async function approveElectiveRequest(req, res) { 
  /*
    Expected payload :
      {
        "request" :
        "remarks" :
      }
  */
  
  var request = await Request.findById(req.body.request);

  if(request == null) {
    return res.status(422).json({code:'422',message:"Request does not exist"});
  }

  var assignment = await Assignment.findOne({
    student : request.student,
    field : request.field
  })

  request.isApproved = true;
  request.remarks = req.body.remarks;

  assignment.isCustom = true;
  
  request.save().then(() => {
    assignment.save().then(assignment => {
      return res.status(200).send(assignment);
    })
    .catch(err => {
      return res.status(422).json({code:'422',message:err});
    })
  })
  .catch(err => {
    return res.status(422).json({code:'422',message:err});
  })
}

module.exports = {
  createRequest : createRequest,
  listSwitchRequests : listSwitchRequests,
  listElectiveRequests : listElectiveRequests,
  approveElectiveRequest : approveElectiveRequest
}