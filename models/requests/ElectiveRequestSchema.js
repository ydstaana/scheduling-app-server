var mongoose = require('mongoose');

var Request = require('./RequestSchema')

var ElectiveRequest = Request.discriminator('ElectiveRequest', 
  new mongoose.Schema({
    field : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Field'
    }
  })
)

module.exports = ElectiveRequest;