/**
 * Main application routes
 */

'use strict';

module.exports = function(app) {
	var r = require,
		path = r('path'),
		phone = r('../automater/sms/texting.js');
	
	// home and api routes
	app.use(r('./home'));
	app.use('/api/investing', r('./stock-api'));
	app.use('/api/blog', r('./blog-api'));


	//sends image files over sms
	app.get('/public/assets/img/:file_id', function (req, res) {
	    res.sendFile(path.resolve('public/assets/img/' + req.params.file_id));
	});

	//Sends text to speech audio files
	app.get('/reports/:file_id', function (req, res) {
	    res.sendFile(path.resolve('app/automater/reports/' + req.params.file_id));
	});

	//Get chart for stocks
	app.get('/charts/:file_id', function (req, res) {
		console.log("Directory name in send fild: " + path.resolve('public/app/shared/charts/', req.params.file_id));
		res.sendFile(path.resolve('public/app/shared/charts/', req.params.file_id));
	});

	app.post('/messaging', function(req, res){
		console.log("Reply has reached localhost server endpoint");
		phone.receiveSMS(req, res);
	});
};
