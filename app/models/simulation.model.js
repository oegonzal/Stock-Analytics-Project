var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var simulation = new Schema({
	name: String,
	createdOn: {type: Date, default: Date.now},
	stocks: Array,
	initial_amount: String,
	available_cash: String,
	stock_value: String,
	transaction_history: Array,
	dayChg: String,
	weekChg: String,
	monthChg: String
	//Ideas: trades, percentage change (can be calculated)
});

//adding to schema...
simulation.add({
	
});

// Expose (export) the model now...
module.exports = mongoose.model('simulations', simulation);


/*
//
var stocksInSimulation = {
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