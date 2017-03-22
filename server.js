var express = require('express'),
	  mongoose = require('mongoose'),
    morgan = require('morgan'),
	  bodyParser = require('body-parser'),
    app = express(),
    port = process.env.PORT || 5000,
    db;


//evnvironment dbs
if(process.env.ENV == 'Test') {
	db = mongoose.connect('mongodb://localhost/stockAPI_test');
}
else {
	db = mongoose.connect('mongodb://localhost/stockAPI');
}	


//middleware

//To allow CORS, //http://stackoverflow.com/questions/11181546/how-to-enable-cross-origin-resource-sharing-cors-in-the-express-js-framework-o
//Might be a security issue with CSS and others
// app.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
//  });
app.use(express.static('public'));	
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

//requirements
require('./app/routes/routes')(app);
require('./app/automater/run.js');

//Message to display when connecting on localhost...
app.listen(port, function(err){
	console.log('running server on port ' + port);
});


////////////////////////
testing(1,2);
function testing(arg1,arg2){
  var i = 1, n = arguments.length, method;
  while(++i < 2) {console.log("Testing...");}
  //console.log(t++);
}
///////////////////////

module.exports = app;










/*
//Testing and practicing javascript for interviews
function tester() {
  declaredFunction();
  referencedFunction();

  function declaredFunction() {
    console.log("I'm a declared function");
  }

  var referencedFunction = function () {
    console.log("I'm an anonymous function called by a reference");
  };
}

tester();
*/