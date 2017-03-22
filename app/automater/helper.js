

var helper = function(){
	var formatHistoricalData = function(data){
		var historicalData = [],
			rawData = data.replace(/\n/g, ",").split(','),
			total = rawData.length,
			curr = 7,
			item = {};

		if((total - 1) % 7 != 0) console.log("WARNING: Total entries from request are not divisible by zero (total: " + total + ")");

		while(total > 8){
			item = {};
			item.date = rawData[curr];
			item.open = rawData[curr + 1];
			item.high = rawData[curr + 2];
			item.low = rawData[curr + 3];
			item.close = rawData[curr + 4];
			item.volume = rawData[curr + 5];
			item.adj_close = rawData[curr + 6];

			historicalData.push(item);
			curr += 7;
			total -= 7;
		}

		return historicalData;
	}

	var test = function(){
		console.log("Testing helper file works.");
	}

	return {
		formatHistoricalData: formatHistoricalData,
		test: test
	}
}

module.exports = helper();