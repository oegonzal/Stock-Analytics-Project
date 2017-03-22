var Grid = require('gridfs-stream'),
	fs = require('fs'),
	multer = require('multer'),
	Schema = mongoose.Schema;
	
//file uploader
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
conn.once('open', function() {
	console.log('open');
	
	var gfs = Grid(conn.db);
	var writestream = gfs.createWriteStream({
		//filename: 'mongo_file.txt'
	});
	
	//fs.createReadStream('/home/etech/sourcefile.txt').pipe(writestream);
	
	writestream.on('close', function (file) {
		//do something with 'file'
		console.log(file.filename + ' Written to DB');
	})
});


/*
module.exports.init = function(app) {
	//var Schema;
	var conn;
	
	Grid.mongo = mongoose.mongo;
	conn = mongoose.createConnection('mongodb://localhost/stockAPI');
	conn.once('open', function() {
		var gfs = Grid(conn.db);
		app.set('gridfs', gfs);
	});
	
	app.set('mongoose', mongoose);
	Schema = mongoose.Schema;
	//setup the schema for DB
	require('../db/schema')(Schema, app);
}
*/