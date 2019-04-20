var Assignment = require('../../models/assignments/AssignmentSchema.js');
var Field = require('../../models/fields/FieldSchema.js');
var FieldGroup = require('../../models/fields/FieldGroupSchema.js');
var Student = require('../../models/users/StudentSchema.js');
var Rotation = require('../../models/rotations/RotationSchema.js');
var Request = require('../../models/requests/RequestSchema.js');

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

function createNewAssignment(group, student, rotation, field) {
  return new Promise(function(resolve, reject) {
    console.log("Creating a new doc...");
    new Assignment({
      student : student.id,
      rotation : rotation.id,
      group : group,
      field : field
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

async function switchAssignments(req, res) {
  /*
    Expected Payload
    {
      request : //Id of request
      remarks : 
    }
  */
  // Deactivate previous assignments of the student from the old rotation
  // Create new assignments from the Fields of the New Rotation
  // Approve the request

  var request = await Request.findById(req.body.request);
  var student = await Student.findById(request.student);
  
  if(student.assignments.length != 0) {
    Assignment.find({
      student : student._id,
      rotation : request.oldRotation
    })
    .then(assignments => {
      assignments.forEach(assign => {
        assign.isActive = false;
        assign.save();
      })
    })
  }

  var newRotation = await Rotation.findById(request.newRotation);
  
  switch(newRotation.rotationType) {
    case RotationType.SINGLE :
      createNewAssignment(newRotation.group, student, newRotation, newRotation.field)
      .then(assign => {
        student.assignments.push(assign);
        student.save().then(() => {
          res.status(200).send(student);
        })
        .catch(err => {
          console.log(err);
          res.status(422).json({
            message: err
          });
        })
      })
      break;
    default :
      var counter = 0;
      var fieldGroup = FieldGroup.findById(newRotation.fieldGroup);
      fieldGroup.fields.forEach(field => {
        createNewAssignment(newRotation.group, student, newRotation, field)
        .then(assign => {
          counter++;
          student.assignments.push(assign);
          if(counter == fieldGroup.fields.length) {
            student.save().then(() => {
              var request = Request.findById(req.body.request);
              request.isApproved = true;
              request.remarks = req.body.remarks;
              request.save().then(() => {
                res.status(200).send(student);
              })
            })
            .catch(err => {
              console.log("NOT HERE???")
              res.status(422).json({
                message: err
              });
          })
        }
      })
    })
    break;
  }
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
  listAssignmentsByStudent : listAssignmentsByStudent,
  listAssignmentsByRotation : listAssignmentsByRotation,
  listAssignmentsByFieldAdmin : listAssignmentsByFieldAdmin,
  switchAssignments : switchAssignments
} 