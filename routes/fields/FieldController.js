var Field = require('../../models/fields/FieldSchema.js');
var User = require('../../models/users/UserSchema.js');
var StandardField = require('../../models/fields/StandardFieldSchema.js');
var MinorField = require('../../models/fields/MinorFieldSchema.js');
var ElectiveField = require('../../models/fields/ElectiveFieldSchema.js');
var FieldGroup = require('../../models/fields/FieldGroupSchema.js');
var StandardFieldGroup = require('../../models/fields/StandardFieldGroupSchema.js');
var MinorFieldGroup = require('../../models/fields/MinorFieldGroupSchema.js');
var ElectiveFieldGroup = require('../../models/fields/ElectiveFieldGroupSchema.js');
var mongoose = require('mongoose');

var FieldTypes = {
  STANDARD : "Standard",
  MINOR : "Minor",
  ELECTIVE : "Elective"
}

var FieldGroupTypes = {
  STANDARD : "Standard Group",
  MINOR : "Minor Group",
  ELECTIVE : "Elective Group"
}

function createField(req, res) {
  switch(req.body.fieldType) {
    case FieldTypes.STANDARD:
      StandardField.create(req.body, function (err, field) {
        if (err) {
          res.status(422).json({
            message: err
          });
        }
        else{
          res.status(200).send(field);
        }
      })
      break;
    case FieldTypes.MINOR:
      MinorField.create(req.body, function (err, field) {
        if (err) {
          res.status(422).json({
            message: err
          });
        }
        else{
          res.status(200).send(field);
        }
      })
      break;
    case FieldTypes.ELECTIVE:
      ElectiveField.create(req.body, function (err, field) {
        if (err) {
          res.status(422).json({
            message: err
          });
        }
        else{
          res.status(200).send(field);
        }
      })
      break;
    default:
      res.status(422).json({
        message: "Invalid rotation type"
      });
  } 
}

function createFieldGroup(req, res) {
  switch(req.body.fieldGroupType) {
    case FieldGroupTypes.STANDARD:
      StandardFieldGroup.create(req.body, function (err, group) {
        if (err) {
          res.status(422).json({
            message: err
          });
        }
        else{
          res.status(200).send(group);
        }
      })
      break; 
    case FieldGroupTypes.MINOR:
      MinorFieldGroup.create(req.body, function (err, group) {
        if (err) {
          res.status(422).json({
            message: err
          });
        }
        else{
          group.fields.forEach(async field => {
            var f = await Field.findById(field);
            f.fieldGroup = group._id;
            f.save();
          })
          res.status(200).send(group);
        }
      })
      break; 
    case FieldGroupTypes.ELECTIVE:
      ElectiveFieldGroup.create(req.body, function (err, group) {
        if (err) {
          res.status(422).json({
            message: err
          });
        }
        else{
          group.fields.forEach(async field => {
            var f = await Field.findById(field);
            f.fieldGroup = group._id;
            f.save();
          })
          res.status(200).send(group);
        }
      })
      break;
  }
  
}

function listFields(req, res) {
  Field.find(req.query)
  .populate('admin')
  .populate('fieldGroup')
  .exec(function(err, fields) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
      else{
        res.status(200).send(fields);
      }
  })
}

function listFieldGroups(req, res) {
  FieldGroup.find({})
  .populate('fields')
  .populate({
    path : 'fields',
    populate : { path : 'admin'}
  })
  .exec(function(err, fields) {
    console.log(fields)
    if (err) {
      res.status(422).json({
        message: err
      });
    }
      else{
        res.status(200).send(fields);
      }
  })
}

async function updateField(req, res) {
  const doc = await Field.findById(req.params.id);

  doc.set(req.body)

  doc.save().then(async function(err) {
    var admin = await User.findById(doc.admin)

    admin.field = doc.id

    await admin.save();

    Field.populate(doc, {path : 'admin'}, function(err, field) {
      res.status(200).send(field);
    })

		
  })
  .catch(err => {
    console.log(err)
    res.status(422).json({code:'422',message:err});
  })
}

function getField(req, res) {
  Field.findById(req.params.id)
  .populate('admin')
  .exec(function(err, field) {
    if (err) {
      res.status(422).json({
        message: err
      });
    }
      else{
        res.status(200).send(field);
      }
  })
}

async function updateFieldGroup(req, res) {
  const doc = await FieldGroup.findById(req.params.id);

  doc.set(req.body)

  doc.save().then(function(err) {
		res.status(200).send(doc);
  })
  .catch(err => {
    res.status(422).json({code:'422',message:err});
  })
}

module.exports = {
  createField : createField,
  listFields: listFields,
  listFieldGroups : listFieldGroups,
  createFieldGroup : createFieldGroup,
  updateField : updateField,
  getField : getField,
  updateFieldGroup : updateFieldGroup
}