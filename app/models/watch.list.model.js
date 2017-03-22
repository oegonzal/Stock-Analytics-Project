var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//This will be the list that stores the individual stocks
var watchList = new Schema({
	name: String,
	length: Number,
	createdOn: {type: Date, default: Date.now},
	stocks: Array
});

//adding to schema...
watchList.add({
	lastModified: Number
});

// Expose (export) the model now...
module.exports = mongoose.model('watchlists', watchList);






/* 
 * Example Schema with no Id:
 *
 * // disabled _id
 * var noIdSchema = new Schema({name: String}, {_id: false});
 *
*/

/*
//This will be the info in each of the list items
var stocksInList = {
	name: String,
	index: String,
	percentage: Number,
	PriceToEarningsRatio: String,
	open: Number,
	close: Number,
	high: Number,
	low: Number,
	inventory: Number,
	lastPurchased: {type: Date, default: Date.now}
};
*/
