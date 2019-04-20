var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: String,
	username: String,
	password: String
},
{
  discriminatorKey: 'kind'
});

UserSchema.statics.authenticate = function (username, password, callback) {
  this.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }

      if(user.password == password){
      	return callback(null, user);
      } else{
      	var err = new Error('Incorrect username/password');
        err.status = 401;
        return callback(err);
      }
      
    });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;