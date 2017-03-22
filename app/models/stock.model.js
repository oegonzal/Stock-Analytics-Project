var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//This will store the trading data of each stock
var stockModel = new Schema({
	name	: { type: String },
	index	: { type: String },
	price	: { type: Number }
});

var historyObj = {
	purchasedDate: {type: Date, default: Date.now},
	tradingOption: String,
	quantity: Number
};

stockModel.add({
	history				: 	Array,
	lastTradingOption	: { type: String },
	lastTradingQuantity	: { type: Number },
	totalInventory		: { type: Number },
	optionInventory		: { type: Number },
	lastTraded			: { type: Date, default: Date.now},
	tradingFee			: { type: Number },
	rating				: { type: Number },
	data				: Array
});

module.exports = mongoose.model('stocks', stockModel);