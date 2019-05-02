var Group = require('../../models/groups/GroupSchema.js');
var User = require('../../models/users/UserSchema.js');
var Student = require('../../models/users/StudentSchema.js');
var Field = require('../../models/fields/FieldSchema.js');
var FieldGroup = require('../../models/fields/FieldGroupSchema.js');
var Rotation = require('../../models/rotations/RotationSchema.js');
var Assignment = require('../../models/assignments/AssignmentSchema.js');
var forAsync = require('for-async')
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

function createNewAssignment(groupId, studentId, rotationId, fieldId) {
  return new Promise(function(resolve, reject) {
    new Assignment({
      student : studentId,
      rotation : rotationId,
      group : groupId,
      field : fieldId
    })
    .save().then(async assign => {
      resolve(assign._id)
    })
    .catch(err => {
      reject(err);
    })
  })
}

var Group = require('../../models/groups/GroupSchema.js');
var User = require('../../models/users/UserSchema.js');
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
    { name: '1', isActive: true, students: [] },
    { name: '2', isActive: true, students: [] },
    { name: '3', isActive: true, students: [] },
    { name: '4', isActive: true, students: [] },
    { name: '5', isActive: true, students: [] },
    { name: '6', isActive: true, students: [] },
    { name: '7', isActive: true, students: [] },
    { name: '8', isActive: true, students: [] },
    { name: '9', isActive: true, students: [] },
    { name: '10', isActive: true, students: [] },
    { name: '11', isActive: true, students: [] },
    { name: '12', isActive: true, students: [] }
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

function createNewAssignment(groupId, studentId, rotationId, fieldId) {
  return new Promise(function(resolve, reject) {
    new Assignment({
      student : studentId,
      rotation : rotationId,
      group : groupId,
      field : fieldId
    })
    .save().then(async assign => {
      resolve(assign._id)
    })
    .catch(err => {
      reject(err);
    })
  })
}

async function createAssignments(group, student) {
  return new Promise(async function(resolve, reject) {
    //Create assignments of the student from the group
    var counter = 0;
    group.rotations.forEach(async rot => {
      var rotation = await Rotation.findById(rot);
    
      if(rotation.isActive == false) {
        resolve();
      }

      rotation.studentCount++;
      rotation.save().then(async newRotation => {
        switch(rotation.rotationType) {
          case RotationType.SINGLE:
            await createNewAssignment(student.group, student.id, rotation.id, rotation.field)
            .then(() => {
              counter++;
              if(counter == group.rotations.length) {
                resolve();
              }
            })
            .catch(error => {
              console.error(error);
              reject(err);
            });
            break;
          default : //For RotationType Elective and Multiple
            var fieldGroup = await FieldGroup.findById(rotation.fieldGroup)
            var fieldCtr = 0;
  
            fieldGroup.fields.forEach(async field => {
              await createNewAssignment(student.group, student.id, rotation.id, field)
              .then(assign => {
                fieldCtr++;
  
                //Add created assignment to student
                student.assignments.push(assign);
                if(fieldCtr == fieldGroup.fields.length) {
                  resolve();               
                }
              })
              .catch(err => {
                reject(err);
              })
            })
            break;
        }
      });
    })
  }) 
}

async function removeStudentFromGroup(studentId, groupId) {
  return new Promise(async function(resolve, reject) {
    await Group.findById(groupId).then(result => {
      var group = result;
      group.students.pull(studentId);
      group.save().then(result => {
        removeAssignmentsFromStudent(studentId, group.id)
        .then(() => {
          forAsync(group.rotations, function(item, idx) {
            return new Promise(async (resolve, reject) => {
              var rotation = await Rotation.findById(item);
              rotation.studentCount--;
              rotation.save()
              .then(newRotation => {
                resolve();
              })
              .catch(err => {
                reject(new Error(err.message));
              })
            });
          })
          .then(() => {
            resolve();
          })
          .catch(err => {
            reject(err);
          })
        })
        .catch(err => {
          reject(err);
        })
      })
      .catch(err => {
        reject(err);
      })
    })
  })
}

function assignToGroup(item, idx) {
  return new Promise(async (resolve, reject) => {
    var student = await Student.findById(item.studentId);
    var newGroup = await Group.findById(item.groupId);

    if(student.group != null) {
      removeStudentFromGroup(student.id, student.group)
      .then(() => {
        student.group = newGroup.id;
        newGroup.students.push(student.id);
        createAssignments(newGroup, student)
        .then(() => {
          student.save().then(() => {
            newGroup.save().then(result => {
              console.log(`${result.firstName} assigned to group ${newGroup.name}`)
              resolve();
            })
            .catch(err => {
              reject(err);
            })
          })
          .catch(err => {
            reject(err);
          })
        })  
      })
    }
    else {
      student.group = newGroup.id;
      createAssignments(newGroup, student)
      .then(() => {
        student.save()
        .then(result => {
           newGroup.students.push(result.id)
           newGroup.save().then(() => {
            console.log(`${result.firstName} assigned to group ${newGroup.name}`)
            resolve();
           })
           .catch(err => {
             reject(new Error(err.message));
           })
           
        })
      })
    }
  })
}

function addStudentToGroup(req, res) {
  /*
    [
      {
        "studentId": "5cb6c75591a3bd08bec4d5e8",
        "groupId": "5cb6c74991a3bd08bec4d5db"
      }
    ]
  */
 var requests = req.body;
 forAsync(requests, async function(item, idx) {
  return assignToGroup(item, idx);
 }).then(() => {
  return res.status(200).json({
    message : "Assignment successful"
  })
 })
 .catch(err => {
   return res.status(422).json({
     message : err.message
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

async function removeAssignmentsFromStudent(studentId, groupId) {
  return new Promise(async function(resolve, reject) {
    var assignments = await Assignment.find({
      group : groupId,
      student : studentId
    })

    var student = await User.findById(studentId);
  
    forAsync(student.assignments, function(item, idx) {
      return new Promise(async (resolve, reject) => {
        var assign = await Assignment.findById(item);
        assign.isActive = false;
        student.assignments.pull(assign.id);
        assign.save().then(() => {
          resolve();
        })
        .catch(err => {
          reject(new Error(err.message));
        })
      })
    })
    .then(() => {
      student.save()
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(err);
      })
    })
    .catch(err => {
      reject(err);
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