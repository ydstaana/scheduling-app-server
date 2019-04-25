var Assignment = require('../../models/assignments/AssignmentSchema.js');
var RequestAssignment = require('../../models/requests/RequestAssignmentSchema.js');
var Field = require('../../models/fields/FieldSchema.js');
var ElectiveField = require('../../models/fields/ElectiveFieldSchema.js');
var FieldGroup = require('../../models/fields/FieldGroupSchema.js');
var Student = require('../../models/users/StudentSchema.js');
var Rotation = require('../../models/rotations/RotationSchema.js');
var Request = require('../../models/requests/RequestSchema.js');
var SwitchRequest = require('../../models/requests/SwitchRequestSchema');
var MedAdmin = require('../../models/users/MedAdminSchema.js');

var RotationType = {
  SINGLE: "Single",
  MULTIPLE: "Multiple",
  SPECIAL : "Special"
}

function createAssignment(req, res) {
  Assignment.create(req.body, async function (err, assignment) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
    else {
      var student = await Student.findById(assignment.student)
      student.assignments.push(assignment.id)
      student.save().then(() => res.status(200).send(assignment));
    }
  });
}

function getAssignment(req, res) {
  Assignment.findById(req.params.id)
  .populate('student')
  .populate('rotation')
  .populate('group')
  .populate('field')
  .populate('admin')
  .exec(function(err, assignment) {
    if(err) {
      res.status(422).json({
        message: err
      });
    }
    else
      res.status(200).send(assignment);
  })
}

async function updateAssignment(req, res) {
  var assign = await Assignment.findById(req.params.id)

  assign.set(req.body); 

  assign.save().then(() => {
    res.status(200).send(assign);
  })
  .catch(err => {
    res.status(422).json({
      message: err
    });
  }) 
}

function listAssignments(req, res) {
  Assignment.find({})
  .populate('student')
  .populate('rotation')
  .populate('group')
  .populate('admin')
  .exec(function (err, assignments) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
      else{
        res.status(200).send(assignments);
      }
  })
}

function listCustomAssignments(req ,res) {
  Assignment.find({
    isCustom: true
  })
  .populate('student')
  .populate({
    path: 'rotation',
    populate: [
      { path: 'schedule' },
      { path: 'field' },
      { 
        path: 'fieldGroup', 
        populate: {
          path: 'fields'
        } 
      },
      { path: 'group' }
    ]
  })
  .populate('group')
  .populate('admin')
  .populate('field')
  .exec(function (err, assignments) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
    else{
      res.status(200).send(assignments);
    }
  })
}

function listAssignmentsByStudent(req ,res) {
  Assignment.find({
    student : req.params.id
  })
  .populate('student')
  .populate({
    path: 'rotation',
    populate: [
      { path: 'schedule' },
      { path: 'field' },
      { 
        path: 'fieldGroup', 
        populate: {
          path: 'fields'
        } 
      },
      { path: 'group' }
    ]
  })
  .populate('group')
  .populate('admin')
  .populate('field')
  .exec(function (err, assignments) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
    else{
      res.status(200).send(assignments);
    }
  })
}

function listAssignmentsByRotation(req ,res) {
  // TO DO -> Filter by isChanged
  Assignment.find({
    rotation : req.params.id
  })
  .populate('student')
  .populate('rotation')
  .populate('group')
  .populate('admin')
  .exec(function (err, assignments) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
    else{
      assignments = assignments.filter(assign => assign.fields)
      res.status(200).send(assignments);
    }
  })
}

function createNewAssignment(groupId, studentId, rotationId, fieldId, isCustom = false) {
  return new Promise(function(resolve, reject) {
    console.log("Creating a new doc...");
    new Assignment({
      student : studentId,
      rotation : rotationId,
      group : groupId,
      field : fieldId,
      isCustom: isCustom
    })
    .save().then(async assign => {
      console.log("Creating a new doc finished executing...");
      resolve(assign._id)
    })
    .catch(err => {
      reject(err);
    })
  })
}

async function approveSwitchRequest(req, res) {
  var request = await Request.findById(req.body.request);

  if(request == null) {
    return res.status(422).json({
      message : "Request does not exist"
    })
  }

  request.remarks = req.body.remarks;
  request.isApproved = true;
  request.isPending = false;
  request.save();

  request.oldAssignments.forEach(async oldAssign => {
    var tempAssign = await Assignment.findById(oldAssign);
    var tempRot = await Rotation.findById(tempAssign.rotation);

    tempRot.studentCount--;
    tempRot.save();

    if(tempAssign == null) {
      return res.status(422).json({
        message: err
      });
    }

    tempAssign.isActive = false;

    tempAssign.save();
   
  });

  var counter = 0;
  request.newAssignments.forEach(async assignment => {
    var requestAssignment = await RequestAssignment.findById(assignment)
    createNewAssignment(requestAssignment.group, requestAssignment.student, requestAssignment.rotation, requestAssignment.field)
    .then(async newAssign => {
      counter++;
      var rotation = await Rotation.findById(requestAssignment.rotation);
      rotation.studentCount++;
      rotation.save();
      if(counter == request.newAssignments.length) {
        res.status(200).send({
          message : "Successfully switched assignments"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(422).send({
        message : err
      });
    })
  })
}

async function listAssignmentsByUMA(req ,res) {
  Assignment.find({
    admin: req.params.id
  })
  .populate('student')
  .populate({
    path: 'rotation',
    populate: [
      { path: 'schedule' },
      { path: 'field' },
      { 
        path: 'fieldGroup', 
        populate: {
          path: 'fields'
        } 
      }
    ]
  })
  .populate('group')
  .populate('admin')
  .populate('field')
  .exec(function (err, assignments) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
    else{
      res.status(200).send(assignments);
    }
  })
}

function listElectivesByStudent(req, res) {
  Assignment.find({
    student : req.params.id
  })
  .populate('field')
  .populate({
    path: 'rotation',
    populate: [
      { path: 'schedule' },
      { path: 'field' },
      { 
        path: 'fieldGroup', 
        populate: {
          path: 'fields'
        } 
      }
    ]
  })
  .exec(function(err, electives) {
    electives = electives.filter(assign => assign.field.fieldType == 'Elective');
    if (err) {
      res.status(422).json({
        message: err
      });
    }
    else{
      res.status(200).send(electives);
    }
  })
}

async function listAssignmentsByFieldAdmin(req ,res) {
  var field = await Field.findOne({
    admin: req.params.id
  })

  if(field == null) {
    return res.status(422).json({
      message: "No fields for this field admin"
    });
  }

  Assignment.find({
    field : field._id
  })
  .populate('student')
  .populate({
    path: 'rotation',
    populate: [
      { path: 'schedule' },
      { path: 'field' },
      { 
        path: 'fieldGroup', 
        populate: {
          path: 'fields'
        } 
      }
    ]
  })
  .populate('group')
  .populate('admin')
  .populate('field')
  .exec(function (err, assignments) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
    else{
      res.status(200).send(assignments);
    }
  })
}

module.exports = {
  createAssignment : createAssignment,
  listAssignments : listAssignments,
  getAssignment : getAssignment,
  updateAssignment : updateAssignment,
  listElectivesByStudent : listElectivesByStudent,
  listAssignmentsByStudent : listAssignmentsByStudent,
  listAssignmentsByRotation : listAssignmentsByRotation,
  listAssignmentsByFieldAdmin : listAssignmentsByFieldAdmin,
  approveSwitchRequest : approveSwitchRequest,
  listAssignmentsByUMA: listAssignmentsByUMA,
  listCustomAssignments: listCustomAssignments
} 