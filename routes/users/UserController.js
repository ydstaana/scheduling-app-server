var User = require('../../models/users/UserSchema.js');
var MedAdmin = require('../../models/users/MedAdminSchema.js');
var Student = require('../../models/users/StudentSchema.js');
var FieldAdmin = require('../../models/users/FieldAdminSchema.js');
var FieldGroup = require('../../models/fields/FieldGroupSchema.js');
var Group = require('../../models/groups/GroupSchema.js');
var Assignment = require('../../models/assignments/AssignmentSchema.js');
var Rotation = require('../../models/rotations/RotationSchema.js');
var mongoose = require('mongoose');

var UserTypes = {
  STUDENT: "Student",
  UST_MEDICINE_ADMIN: "UST Medicine Admin",
  FIELD_ADMIN: "Field Admin"
}

var RotationType = {
  SINGLE: "Single",
  MULTIPLE: "Multiple",
  SPECIAL : "Special"
}

function login(req, res) {
  User.authenticate(req.body.email, req.body.password, function (err, user) {
    if (err) {
      res.status(403).json({
        success: false,
        message: err.message,
      });
    }
      
    else {
      res.status(200).json({
       id: user._id,
       userType : user.userType,
       firstName: user.firstName,
       middleName: user.middleName,
       lastName: user.lastName,
       address: user.address,
       mobileNumber: user.mobileNumber,
       isActive:  user.isActive,
       contactPersonName: user.contactPersonName,
       contactPersonNumber: user.contactPersonNumber,
       email: user.email,
       status: user.status,
       dateCreated : user.dateCreated,
       lastModified: user.lastModified
     });
    }
  })
} 

function getStudent(req, res) {
  Student.findById(req.params.id)
  .populate('group')
  .populate('field')
  .exec(function(err, user) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
      else{
        res.status(200).send(user);
      }
  })
}

function getFieldAdmin(req, res) {
  FieldAdmin.findById(req.params.id)
  .populate('field')
  .exec(function(err, user) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
      else{
        res.status(200).send(user);
      }
  })
}

function getMedAdmin(req, res) {
  MedAdmin.findById(req.params.id)
  .exec(function(err, user) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
      else{
        res.status(200).send(user);
      }
  })
}

function getUser(req, res) {
  User.findById(req.params.id)
  .exec(function(err, user) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
      else{
        res.status(200).send(user);
      }
  })
}

async function changePassword(req,res) {
  var user = await User.findById(req.params.id)

  User.authenticate(req.body.email, req.body.oldPassword, function (err, user) {
    if (err) {
      res.status(403).json({
        success: false,
        message: err.message,
      });
    }

    user.password = req.body.newPassword;
    user.save()
    .then(() => {
      res.status(200).send(user);
    })
  })
}
async function resetPassword(req, res) {
  var user = await User.findOne({
    email : req.body.email
  })

  if(user == null) {
    res.status(422).json({
      message: "Email isn't recognized"
    })
  }

  user.password = "user123";

  user.save().then(result => {
    res.status(200).send(result);    
  })
  .catch(err => {
    res.status(422).json({
      message: err
    })
  })
}

async function createUser(req, res) {
  // TODO: Improve setting default password
  const defaultPassword = 'user123';
  req.body.password = defaultPassword;

  switch(req.body.userType) {
    case UserTypes.STUDENT: 
      Student.create(req.body, function (err, user) {
        if (err) {
          res.status(422).json({
            message: err
          });
        }
          else{
            res.status(200).send(user);
          }
      });
      break;
    case UserTypes.UST_MEDICINE_ADMIN :
      MedAdmin.create(req.body, function (err, user) {
        if (err) {
          res.status(422).json({
            message: err
          });
        }
          else{
            res.status(200).send(user);
          }
      });
      break;
    case UserTypes.FIELD_ADMIN :
      FieldAdmin.create(req.body, function (err, user) {
        if (err) {
          res.status(422).json({
            message: err
          });
        }
          else{
            res.status(200).send(user);
          }
      });
      break;
  }
};

function listUsers(req, res) {
  User.find({})
  .populate('field')
  .populate('group')
  .exec(function(err, users) {
    if(err) res.status(422).json({code:'422',message:err});
    
		else{
			res.status(200).send(users);
		}
	})
}

function listMedAdmins(req, res) {
  MedAdmin.find({}, function(err, users) {
		if(err) res.status(422).json({code:'422',message:err});
		else{
			res.status(200).send(users);
		}
	})
}

function listFieldAdmins(req, res) {
  FieldAdmin.find({}, function(err, users) {
		if(err) res.status(422).json({code:'422',message:err});
		else{
			res.status(200).send(users);
		}
	})
}
function listStudents(req, res) {
  Student.find({}, function(err, users) {
		if(err) res.status(422).json({code:'422',message:err});
		else{
			res.status(200).send(users);
		}
	})
}

function listUnassignedStudents(req, res) {
  Student.find({
    group : null
  }, function(err, users) {
		if(err) res.status(422).json({code:'422',message:err});
		else{
			res.status(200).send(users);
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

async function updateUserProfile(req, res) {
  const doc = await User.findById(req.params.id);
  doc.set(req.body);
  doc.save().then(() => {
    res.status(200).send(doc);
  })
  .catch(err => {
    res.status(422).json({code:'422', message: err});
  });
}

async function updateUser(req, res) {
  const doc = await User.findById(req.params.id);

  if(doc.group != req.body.group) {
    const newGroup = await Group.findById(req.body.group);
    var counter = 0;

    if(doc.assignments.length != 0)
      doc.assignments.forEach(async assign => {
        var tempAssign = await Assignment.findById(assign)
        tempAssign.isActive = false;
        tempAssign.save();
      })
    
    if(newGroup == null) {
      return res.status(422).json({code:'422', message: "Group does not exist"});
    }

    if(doc.group != null) {
      const oldGroup = await Group.findById(doc.group);
      oldGroup.students.splice(oldGroup.students.indexOf(doc.id), 1)
      oldGroup.save();
    }

    if(newGroup.rotations.length == 0) {
      newGroup.students.push(doc.id);
      newGroup.save();
      doc.set(req.body);
      doc.save().then(() => {
        res.status(200).send(doc);
      })
      .catch(err => {
        return res.status(422).json({code:'422', message: err});
      })
    }
    newGroup.rotations.forEach(async rotation => {
      var rot = await Rotation.findById(rotation);
      switch(rot.rotationType) {
        case RotationType.SINGLE :
          createNewAssignment(newGroup, doc, rot, rot.field)
          .then(result => {
            counter++;
            doc.assignments.push(result);
            if(counter == newGroup.rotations.length) {
              doc.save().then(async () => {
                newGroup.save().then(result => {
                  res.status(200).send(doc);
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
            createNewAssignment(newGroup, doc, rot, field)
            .then(result => {
              fieldCtr++;
              doc.assignments.push(result);
              if(fieldCtr == fieldGroup.fields.length) {
                counter++;
                if(counter == newGroup.rotations.length) {
                  doc.save().then(async () => {
                    newGroup.save().then(result => {
                      res.status(200).send(doc);
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
  }
  else {
    doc.set(req.body)

    doc.save().then(() => {
      res.status(200).send(doc);
    })
    .catch(err => {
      res.status(422).json({code:'422',message:err});
    })
  }
}

async function updateStudent(req, res) {
  console.log(req.body);
  const doc = await Student.findById(req.params.id);

  if(doc.group != req.body.group) {
    const newGroup = await Group.findById(req.body.group);
    var counter = 0;
    
    if(newGroup == null) {
      return res.status(422).json({code:'422', message: "Group does not exist"});
    }

    if(doc.group != null) {
      const oldGroup = await Group.findById(doc.group);
      oldGroup.students.splice(oldGroup.students.indexOf(doc.id), 1)
      oldGroup.save();
    }

    if(newGroup.rotations.length == 0) {
      newGroup.students.push(doc.id);
      newGroup.save();
      doc.set(req.body);
      doc.save().then(() => {
        res.status(200).send(doc);
      })
      .catch(err => {
        return res.status(422).json({code:'422', message: err});
      })
    }
    newGroup.rotations.forEach(async rotation => {
      var rot = await Rotation.findById(rotation);
      switch(rot.rotationType) {
        case RotationType.SINGLE :
          createNewAssignment(newGroup, doc, rot, rot.field)
          .then(result => {
            counter++;
            doc.assignments.push(result);
            if(counter == newGroup.rotations.length) {
              doc.save().then(async () => {
                newGroup.save().then(result => {
                  res.status(200).send(doc);
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
            createNewAssignment(newGroup, doc, rot, field)
            .then(result => {
              fieldCtr++;
              doc.assignments.push(result);
              if(fieldCtr == fieldGroup.fields.length) {
                counter++;
                if(counter == newGroup.rotations.length) {
                  doc.save().then(async () => {
                    newGroup.save().then(result => {
                      res.status(200).send(doc);
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
  }
  else {
    doc.set(req.body)

    doc.save().then(() => {
      res.status(200).send(doc);
    })
    .catch(err => {
      res.status(422).json({code:'422',message:err});
    })
  }
}

module.exports = {
  login : login,
  getUser : getUser,
  getStudent : getStudent,
  getFieldAdmin : getFieldAdmin,
  getMedAdmin : getMedAdmin,
  createUser: createUser,
  listUsers: listUsers,
  resetPassword : resetPassword,
  listMedAdmins : listMedAdmins,
  listFieldAdmins : listFieldAdmins,
  listStudents : listStudents,
  changePassword : changePassword,
  listUnassignedStudents : listUnassignedStudents,
  updateUser : updateUser,
  updateUserProfile: updateUserProfile,
  updateStudent: updateStudent
}