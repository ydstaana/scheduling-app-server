var Group = require('../../models/groups/GroupSchema.js');
var Student = require('../../models/users/StudentSchema.js');
var Field = require('../../models/fields/FieldSchema.js');
var FieldGroup = require('../../models/fields/FieldGroupSchema.js');
var Rotation = require('../../models/rotations/RotationSchema.js');
var Assignment = require('../../models/assignments/AssignmentSchema.js');

var RotationType = {
  SINGLE: "Single",
  MULTIPLE: "Multiple",
  SPECIAL : "Special"
}

function createGroup(req, res) {
  Group.create(req.body, function (err, group) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
    else{
      res.status(200).send(group);
    }
  });
}

async function createDefaultGroups(req, res) {
  const groups = [
    { name: 'Group 1', isActive: true, students: [] },
    { name: 'Group 2', isActive: true, students: [] },
    { name: 'Group 3', isActive: true, students: [] },
    { name: 'Group 4', isActive: true, students: [] },
    { name: 'Group 5', isActive: true, students: [] },
    { name: 'Group 6', isActive: true, students: [] },
    { name: 'Group 7', isActive: true, students: [] },
    { name: 'Group 8', isActive: true, students: [] },
    { name: 'Group 9', isActive: true, students: [] },
    { name: 'Group 10', isActive: true, students: [] },
    { name: 'Group 11', isActive: true, students: [] },
    { name: 'Group 12', isActive: true, students: [] }
  ];

  groups.forEach(async (g) => {
    await Group.create(g);
  });

  res.status(200).send({});
}

function getGroup(req, res) {
  Group.findById(req.params.id)
  .populate('students')
  .populate('rotation')
  .exec(function(err, group) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
    else{
      res.status(200).send(group);
    }
  })
}

function listGroups(req, res) {
  Group.find({})
    .populate('students')
    .populate('rotations')
    .exec( function(err, groups) {
      if(err) res.status(422).json({code:'422',message:err});
      else{
        res.status(200).send(groups);
      }
    })
}

function createNewAssignment(group, student, rotation, field) {
  return new Promise(function(resolve, reject) {
    console.log("Creating a new doc...");
    new Assignment({
      student : student.id,
      rotation : rotation.id,
      group : group.id,
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
async function addStudentToGroup(req, res) {
  const requests = req.body;
  requests.forEach(async request => {
    var student = await Student.findById(request.studentId);
    if(student == null) {
      return res.status(422).json({code:'422', message: "Student does not exist"});
    }

    if(student.group != null) {
      const oldGroup = await Group.findById(student.group);
      oldGroup.students.splice(oldGroup.students.indexOf(student.id), 1)
      oldGroup.save();
    }
    student.group = request.groupId;
    
    if(student.assignments.length != 0)
      student.assignments.forEach(async assign => {
        var tempAssign = await Assignment.findById(assign)
        tempAssign.isActive = false;
        tempAssign.save();
      })

    const newGroup = await Group.findById(student.group);
    
    if(newGroup == null) {
      return res.status(422).json({code:'422', message: "Group does not exist"});
    }

    newGroup.students.push(student.id);

    var counter = 0;

    if(newGroup.rotations.length == 0) {
      student.save().then(async () => {
        newGroup.save().then(result => {
          return res.status(200).send(student);
        });
      })
      .catch(err => {
        return res.status(422).json({code:'422', message: err});
      }) 
    }

    newGroup.rotations.forEach(async rotation => {
      var rot = await Rotation.findById(rotation);
      switch(rot.rotationType) {
        case RotationType.SINGLE :
          createNewAssignment(newGroup, student, rot, rot.field)
          .then(result => {
            counter++;
            student.assignments.push(result);
            if(counter == newGroup.rotations.length) {
              student.save().then(async () => {
                newGroup.save().then(result => {
                  res.status(200).send(student);
                });
              })
              .catch(err => {
                return res.status(422).json({code:'422', message: err});
              }) 
            }
          })
          break;
        default :
          var fieldGroup = await FieldGroup.findById(rot.fieldGroup)
          var fieldCtr = 0;
          fieldGroup.fields.forEach(field => {
            createNewAssignment(newGroup, student, rot, field)
            .then(result => {
              fieldCtr++;
              student.assignments.push(result);
              if(fieldCtr == fieldGroup.fields.length) {
                counter++;
                if(counter == newGroup.rotations.length) {
                  student.save().then(async () => {
                    newGroup.save().then(result => {
                      res.status(200).send(student);
                    });
                  })
                  .catch(err => {
                    return res.status(422).json({code:'422', message: err});
                  }) 
                }
              }
            })
          })
          break;
      }
    })    
  })
}

module.exports = {
  createGroup : createGroup,
  listGroups : listGroups,
  addStudentToGroup : addStudentToGroup,
  getGroup : getGroup,
  createDefaultGroups: createDefaultGroups  
}