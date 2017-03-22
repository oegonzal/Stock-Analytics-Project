var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var dashboard = new Schema({
	name: 	String,
	queried_on: {type: Date, default: Date.now},
	articles: Array,
	data: 	Array
});

// Expose (export) the model now...
module.exports = mongoose.model('dashboards', dashboard);