
// TODO: LASTLY USE MACHINE LEARNING TO FIND MOST OPTIMAL INDICATOR FOR EACH FOR SPECIFIC PARAMETERS
// BY COMPARING THEM WITH ALL PAST PRICE RESULTS

var stockAnalysis = function(){

	//Range of 5 and above start to lose RSI accuracy for really volatile stocks like NUGT and JNUG
	var stockRSIScore = function(data, options, callback) {
		
		//smoothingfactor should be picked dependent on volatility score
		//Bigger the smoothing constant the more it goes back in history to caclulate an avg RSI (could be more/less accurate representation of RSI (less the more volatile stock is (probably)))
		var smoothingConstant = options.smoothingC || 25, //volatile stocks like NUGT and JNUG only want to go back about 20 records (more than that becomes inaccurate)
			range = options.range || 14,
			change = 0,
			negativeSum = 0,
			positiveSum = 0,
			negativeAvg = 0,
			positiveAvg = 0,
			RS = 0,
			RSI = 0;

		//CHECKS  

		//Make sure no array overflow
		while(range + smoothingConstant > data.length && smoothingConstant > 0){
			smoothingConstant--;
		}

		var smoothingFactor = range + smoothingConstant;

		//if too big, print error, array overflow;
		if(range + smoothingConstant > data.length){ data[0].RSI = "Data is too small"; callback("Data is too small"); console.log("Array overflow for RSI calculation."); return;}
		if(range == 1){
			change = data[0].adj_close - data[1].adj_close;
			if(change > 0) return 100;
			else return 0;
		}

		//Get smoothing RSI 	//TODO: cornercase when smoothingConstant ends up being equal to 0 
		for(var i = smoothingFactor + range - 1; i > smoothingFactor - 1; i--){
			change = data[i-1].adj_close - data[i].adj_close;
			if(change > 0) positiveSum += change;
			else if(change < 0) negativeSum += change;
		}

		//details for data[smoothingFactor - 1]
		negativeSum = (-1 *negativeSum);
		positiveAvg = positiveSum/range;
		negativeAvg = negativeSum/range;
		RS = positiveAvg/negativeAvg;

		for(var i = smoothingFactor - 1; i > 0; i--){
			change = data[i-1].adj_close - data[i].adj_close;

			//console.log("data["+(i-1)+"].adj_close - data["+i+"].adj_close - change => " + data[i-1].adj_close +" - "+ data[i].adj_close + "    " + change);

			if(change > 0){
				positiveSum = (positiveAvg*(range-1)) + change;
				negativeSum = (negativeAvg*(range-1));
			} 
			else if(change < 0){
				positiveSum = (positiveAvg*(range-1));
				negativeSum = (negativeAvg*(range-1)) + (-1*change);
			}

			//details for data[i-1]
			positiveAvg =  positiveSum/range;
			negativeAvg =  negativeSum/range;
			RS = positiveAvg/negativeAvg;
		}


		//RSI for data[0]
		RSI = 100 - (100/(1+RS));

		data[0].RSI = RSI;
		callback(RSI);
	}

	//***** http://www.investopedia.com/articles/active-trading/041814/four-most-commonlyused-indicators-trend-trading.asp
	var trendLine = function(stockList){

	}

	var priceStdDeviation = function(stockList, options, callback) {
		var sum = 0,
			avg = 0,
			curr = 0,
			SD = 0,
			mean = 0,
			start = options.start_day || 0,
			range = options.range || 50,
			item = {};

		for(var i = start; i < start + range; i++){
			sum += parseInt(stockList[i].adj_close);
		}

		mean = sum/range;
		sum = 0;

		for(var i = start; i < start + range; i++){
			sum += ((mean - stockList[i].adj_close)*(mean - stockList[i].adj_close));
		}

		avg = sum/range;

		var SD = Math.sqrt(avg);
		item.SD = SD;
		item.mean = mean;
		item.SDAsPercentageOfMean = ((SD/mean) * 100);
		callback(item);
	}

	//Dont try ranges higher than 30 for any of these bc yahoo's data is a little messed up for some stocks (like: adj_close and close are switched in the past)
	function avgDayRange(stockList, options, callback){
		var sum = 0,
			avg = 0,
			start = options.start_day || 0,
			range = options.range || 50;

		for(var i = start; i < start + range; i++){
			sum += (Math.abs(stockList[i].low - stockList[i+1].high)/stockList[i+1].adj_close);
		}

		avg = sum/range;
		callback(avg);
	}

	//trend indicator
	var stockMovingAverageScore = function(){
		var sum = 0,
			avg = 0,
			curr = 0,
			SD = 0,
			mean = 0,
			start = options.start_day || 0,
			range = options.range || 50,
			item = {};
	}

	//momentum indicator
	var stochasticScore = function(){

	}

	var MACDScore = function(){

	}

	var priceActionScore = function(){

		return {
			supportLevel: 0,
			resistanceLevel: 100 
		}
	}

	var CCIScore = function(){

	}

	return {
		stockRSIScore: stockRSIScore,
		priceStdDeviation: priceStdDeviation,
		avgDayRange: avgDayRange
	}
}

module.exports = stockAnalysis();


/*
	Swing Trading
	


	Notes:
	 RSI - Like many momentum oscillators, overbought and oversold readings for RSI work best when prices move sideways within a range

*/