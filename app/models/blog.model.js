var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blog = new Schema({
	title: String,
	createdOn: {type: Date, default: Date.now},
	text: String
});

// Expose (export) the model now...
module.exports = mongoose.model('blogs', blog);