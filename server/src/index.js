const 
  bodyParser = require('body-parser'),
  express = require('express'),
  https = require('https'),  
  axios = require('axios'),
  mongoose = require('mongoose');

  
mongoose.connect('mongodb://root:root123@ds137596.mlab.com:37596/med-clerkship')
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

var app = express();
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

app.use(function(req, res, next) {
//set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

var routes = require('./src/routes/routes');

//SET ROUTE FOR API
app.use(routes);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
