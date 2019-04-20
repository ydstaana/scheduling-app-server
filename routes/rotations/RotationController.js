var mongoose = require('mongoose');

var Rotation = require('../../models/rotations/RotationSchema.js');
var SingleRotation = require('../../models/rotations/SingleRotationSchema.js');
var MultipleRotation = require('../../models/rotations/MultipleRotationSchema.js');
var SpecialRotation = require('../../models/rotations/SpecialRotationSchema.js');

var Group = require('../../models/groups/GroupSchema.js');
var Assignment = require('../../models/assignments/AssignmentSchema.js');

var RotationType = {
  SINGLE: "Single",
  MULTIPLE: "Multiple",
  SPECIAL : "Special"
}

function createRotation(req, res) {
  switch(req.body.rotationType) {
    case RotationType.SINGLE :
      SingleRotation.create(req.body, async function (err, rotation) {
        if (err) {
          res.status(422).json({
            message: err
          });
        }
        else {
          // Associate group to rotation
          var group = await Group.findById(rotation.group)
          if(group == null) {
            return res.status(422).json({
              message : "Group does not exist"
            })
          }

          group.rotations.push(rotation.id)
          group.save().then(() => {
            res.status(200).send(rotation);
          })
          .catch(err => {
            res.status(422).json({
              message : err
            })
          })
        }
      });
      break;
      case RotationType.MULTIPLE :
        MultipleRotation.create(req.body, async function (err, rotation) {
          if (err) {
            res.status(422).json({
              message: err
            });
          }
          else {
            // Associate group to rotation
            var group = await Group.findById(rotation.group)
            group.rotations.push(rotation.id)
            group.save().then(() => {
              res.status(200).send(rotation);
            })
            .catch(err => {
              res.status(422).json({
                message : err
              })
            })
          }
        });
        break;
      case RotationType.SPECIAL :
        SpecialRotation.create(req.body, async function (err, rotation) {
          if (err) {
            res.status(422).json({
              message: err
            });
          }
          else {
            // Associate group to rotation
            var group = await Group.findById(rotation.group)
            group.rotations.push(rotation.id)
            group.save().then(() => {
              res.status(200).send(rotation);
            })
            .catch(err => {
              res.status(422).json({
                message : err
              })
            })
          }
        });
        break;
  }
}

function getRotation(req, res) {
  Rotation.findById(req.params.id)
  .populate('schedule')
  .populate ('group')
  .populate('field')
  .exec(function(err, rotation) {
    if(err) {
      res.status(422).json({
        message: err
      });
    }
    else {
      res.status(200).send(rotation);
    }
  })
}

function listRotations(req, res) {
  Rotation.find({})
  .populate('schedule')
  .populate ('group')
  .populate({
    path : 'field',
    populate : { path : 'admin'}
  })
  .populate({
    path: 'fieldGroup',
    populate: {
      path: 'fields',
      populate: {
        path: 'admin'
      }
    }
  })
  .exec(function(err, rotations) {
    if(err) {
      res.status(422).json({
        message: err
      });
    }
    else {
      res.status(200).send(rotations);
    }
  })
}

function rotationLookup(req, res) {
  Rotation.findOne({
    schedule : req.body.schedule
  })
  .populate('schedule')
  .populate ('group')
  .exec(function(err, rotation) {
    if(err) {
      res.status(422).json({
        message: err
      });
    }
    else {
      res.status(200).send(rotation);
    }
  })
}

module.exports = {
  createRotation : createRotation,
  listRotations : listRotations,
  rotationLookup : rotationLookup,
  getRotation : getRotation
}