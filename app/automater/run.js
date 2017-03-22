
// var collectData = require('./scrapeData/dataCollect.js'),
// 				  request = require('request');


// //Temp hard coded stocks
// var stockList = 
//       [
//         'DUST' ,'DWTI','YINN','RGLS','UNXL','OGXI','BCEI','MITK','OCN','AMD','TQQQ','ACAD','JETS','AMAG','RUSS','ERY','Z','DRWI','VRX','LL','FAS','TNA','ILMN','PBR','RPRX','ABIO','MTCH','CLF','PBMD','TZA','CBAY','ERX','ORIG','SRPT','LGCY','X','FAZ','GDX','USO','RUSL','MRO','FCX','SQQQ','PTX','DNR','SWN','YANG','USLV','FATE','UWTI','CHK','NUGT','JNUG','XRA','UVXY','TVIX'
//       ];
// var stockList = ['GDX', 'DUST', 'NUGT', 'JNUG', 'JDST', 'DWTI', 'UWTI', 'UVXY'];

// //RUN
// collectData.cycleQuery();				
// var options = { RSI_range: 8, RSI_smoothingC: 25, SD_start_day: 0, SD_range: 25, avgRange_range: 30 }; // smoothingC: 25 works very well
// collectData.storeStocksHistoricalData(stockList, options );
// //collectData.searchGoogleNews('crude oil', function(articles){console.log(articles);});
// var links = [
// 				"http://www.cnbc.com/2016/09/28/oil-prices-climb-on-opec-deal-lack-of-detail-caps-gains.html",
// 				"http://www.reuters.com/article/us-global-markets-idUSKCN11Z01H",
// 				"http://seekingalpha.com/article/4009309-get-excited-crude-oil",
// 				"http://seekingalpha.com/article/4009303-crude-oil-soar-80-happens",
// 				"http://www.marketwatch.com/story/oil-prices-barely-higher-as-market-wary-over-opec-production-agreement-2016-09-29",
// 				"https://www.dailyfx.com/forex/fundamental/daily_briefing/daily_pieces/commodities/2016/09/29/Crude-Oil-Prices-May-Struggle-to-Extend-OPEC-Triggered-Rally.html",
// 				"https://www.theguardian.com/business/2016/sep/29/oil-price-rise-shares-opec-cut-output",
// 				"http://www.marketwatch.com/story/crude-higher-but-market-faces-long-wait-for-next-opec-move-on-output-2016-09-28",
// 				"http://www.cnbc.com/2016/09/27/oil-prices-climb-after-industry-data-shows-us-stocks-draw.html",
// 				"https://www.thestreet.com/story/13787480/1/crude-oil-prices-rise-with-rumors-of-opec-production-curtailment.html",
// 				"http://www.vox.com/2016/9/29/13104924/crude-oil-prices-opec-cut",
// 				"https://www.dailyfx.com/forex/technical/home/analysis/usoil/2016/09/27/Crude-Oil-Price-Forecast-Oil-Drops-on-Signs-of-Failed-Accord-TYOIL.html"
// 			];
// for(var link in links){
// 	collectData.getArticleText(links[link], function(article){
// 		console.log(article + " ------------------ " + link);
// 	});
// }		

// request('http://marketdata.websol.barchart.com/getQuote.json?key=8bf7f31c837e6b14704f36bcee1d3414&symbols=ZC*1,IBM,GOOGL,^EURUSD,NUGT,DUST,BCEI,JNUG,UWTI,DWTI&fields=tradeSize,bid,ask,askSize,bidSize', function(error, response, body){
// 	if(error){console.log('Error');}

// 	console.log("Body: " + body);
// });

// collectData.getETFHoldings('gdx', function(data){
// 	console.log("Here is the GDX DATA: " + JSON.stringify(data));
// });

// collectData.leverageFund('uwti', 'OIL', 20, function(data){
// 	console.log("Leverage ratios: " + JSON.stringify(data));
// })

// collectData.leverageFund('nugt', 'gdx', 100, function(data){
// 	console.log("Leverage ratios nugt: " + JSON.stringify(data));
// })

// collectData.leverageFund('jnug', 'gdx', 100, function(data){
// 	console.log("Leverage ratios jnug: " + JSON.stringify(data));
// })

//collectData.getGoogleSearchUrl('rjeoj');


