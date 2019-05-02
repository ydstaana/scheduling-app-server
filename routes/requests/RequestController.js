var Request = require('../../models/requests/RequestSchema')
var User = require('../../models/users/UserSchema')
var RequestAssignment = require('../../models/requests/RequestAssignmentSchema')
var SwitchRequest = require('../../models/requests/SwitchRequestSchema')
var Assignment = require('../../models/assignments/AssignmentSchema.js')
var ElectiveRequest = require('../../models/requests/ElectiveRequestSchema')
var ResetRequest = require('../../models/requests/ResetRequestSchema')
var User = require('../../models/users/UserSchema')

var RequestTypes = {
  SWITCH : "SwitchRequest",
  ELECTIVE: "ElectiveRequest"
}

async function createResetRequest(req, res) {
  var user = await User.findOne({
    email : req.body.email
  })

  if(user == null) {
    return res.status(422).json({
      message: "Email is not associated to any account"
    });
  }
  else {
    ResetRequest.create(req.body, (err, request) => {
      if(err) {
        res.status(422).json({
          message: err
        });
      }
      else {
        res.status(200).send(request);
      }
    })
  }
  
}
function listResetRequests(req, res) {
  ResetRequest.find({}, (err, requests) => {
    if(err) {
      res.status(422).json({
        message: err
      });
    }
    else {
      res.status(200).send(requests);
    }
  })
}

async function approveResetRequest(req, res) {
  ResetRequest.findById(req.params.id,async (err, request) => {
    if(err) {
      return res.status(422).json({
        message: err
      });
    }
    else {
      var user = await User.findOne({
        email : request.email
      })

      if(req.body.approve) {
        user.password = "user123"
        user.save()
        .then((result) => {
          request.isApproved = true;
          request.dateModified = new Date();
          request.save().then(() => {
            res.status(200).json({
              message : "Successfully reset password"
            });
          })
          .catch(err => {
            return res.status(422).json({
              message: err
            });
          })
       })
       .catch(err => {
          return res.status(422).json({
            message: err
          });
       })
      }
      else {
        request.isApproved = false;
        request.dateModified = new Date();
          request.save().then(() => {
            res.status(200).json({
              message : "Request disapproved"
            });
          })
          .catch(err => {
            return res.status(422).json({
              message: err
            });
          })
      }
    }
  }) 
}

function createRequest(req, res) {
  var requests = [];
  switch(req.body.requestType) {
    case RequestTypes.SWITCH :
      var counter = 0;
      req.body.newAssignments.forEach(newAssign => {
        var request = new RequestAssignment({
          student : newAssign.student,
          rotation : newAssign.rotation,
          group : newAssign.group,
          field : newAssign.field
        });
        request.save().then(reqAssign => {
          counter++;
          requests.push(reqAssign._id);
          if(counter == req.body.newAssignments.length) {
            req.body.newAssignments = requests;
            SwitchRequest.create(req.body, function(err, request) {
              if(err)
                res.status(422).json({code:'422',message:err});
              else
                res.status(200).send(request);
            })
          }
        });
      });
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

function getRequest(req, res) {
  Request.findById(req.params.id)
  .populate('newAssignments')
  .populate({
    path: 'newAssignments',
    populate: [
      { path: 'student' },
      { path: 'rotation' },
      { path: 'group' },
      { path: 'field'}
    ]
  })
  .exec(function(err, request) {
    if(err)
      res.status(422).json({code:'422',message:err});
    else
      res.status(200).send(request);
  })
}

async function updateRequest(req, res) {
  var request = await Request.findById(req.params.id)

  request.set(req.body); 

  request.save().then(() => {
    res.status(200).send(request);
  })
  .catch(err => {
    res.status(422).json({
      message: err
    });
  }) 
}

function listSwitchRequests(req, res) {
  SwitchRequest.find({})
  .populate({
    path: 'student',
    populate: {
      path: 'group'
    }
  })
  .populate('admin')
  .populate('field')
  .populate({
    path: 'oldAssignments',
    populate: [
      { path: 'student' },
      { path: 'rotation', populate: { path: 'schedule' } },
      { path: 'group' },
      { path: 'field'}
    ]
  })
  .populate({
    path: 'newAssignments',
    populate: [
      { path: 'student' },
      { path: 'rotation', populate: { path: 'schedule' } },
      { path: 'group' },
      { path: 'field'}
    ]
  })
  .exec(function(err, requests) {
    if(err)
      res.status(422).json({code:'422',message:err});
    else
      res.status(200).send(requests);
  })
}

function listSwitchRequestsByStudent(req, res) {
  SwitchRequest.find({
    student: req.params.id
  })
  .populate('student')
  .populate('admin')
  .populate('field')
  .populate({
    path: 'oldAssignments',
    populate: [
      { path: 'student' },
      { path: 'rotation', populate: { path: 'schedule' } },
      { path: 'group' },
      { path: 'field'}
    ]
  })
  .populate({
    path: 'newAssignments',
    populate: [
      { path: 'student' },
      { path: 'rotation', populate: { path: 'schedule' } },
      { path: 'group' },
      { path: 'field'}
    ]
  })
  .exec(function(err, requests) {
    if(err)
      res.status(422).json({code:'422',message:err});
    else
      res.status(200).send(requests);
  });
}

function listElectiveRequests(req, res) {
  ElectiveRequest.find({})
  .populate({
    path: 'student',
    populate: { path: 'group' }
  })
  .populate('admin')
  .populate({
    path: 'assignment',
    populate: { path: 'field' }
  })
  .populate('')
  .exec(function(err, requests) {
    if(err)
      res.status(422).json({code:'422',message:err});
    else
      res.status(200).send(requests);
  });
}

function listElectiveRequestsByStudent(req, res) {
  ElectiveRequest.find({
    student: req.params.id
  })
  .populate('student')
  .populate('admin')
  .populate({
    path: 'assignment',
    populate: { path: 'field' }
  })
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
  console.log(request);

  if(request == null) {
    return res.status(422).json({code:'422',message:"Request does not exist"});
  }

  var assignment = await Assignment.findById(request.assignment);

  request.isApproved = true;
  request.isPending = false;
  request.dateModified = new Date();
  request.remarks = req.body.remarks;

  assignment.isCustom = true;
  assignment.message = request.message;
  
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
  createResetRequest : createResetRequest,
  listResetRequests : listResetRequests,
  approveResetRequest : approveResetRequest,
  getRequest : getRequest,
  listSwitchRequests : listSwitchRequests,
  listSwitchRequestsByStudent: listSwitchRequestsByStudent,
  listElectiveRequests : listElectiveRequests,
  approveElectiveRequest : approveElectiveRequest,
  updateRequest: updateRequest,
  listElectiveRequestsByStudent: listElectiveRequestsByStudent
}