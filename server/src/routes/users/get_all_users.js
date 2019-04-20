const mongoose = require('mongoose');
var User = require('../../models/users/UserSchema.js');

module.exports = function(req, res){
	User.find({}, function(err, users) {
		if(err) res.status(422).json({code:'422',message:err});
		else{
			res.status(200).send(users);
		}
	})
}