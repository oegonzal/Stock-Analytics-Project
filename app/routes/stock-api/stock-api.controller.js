var Dashboard = require('../../models/stock.dashboard.model.js'),
	Simulation = require('../../models/simulation.model.js'),
	dataCollect = require('../../automater/scrapeData/dataCollect.js'),
	speech = require('../../automater/textToSpeech/textToSpeech.js'),
	phone = require('../../automater/sms/texting.js'),
	vars = require('../../../config/vars.js'),
	yahooFinance = require('yahoo-finance');


var stockController = function(Stock) {
	var post = function(req, res){ 
		var stock = new Stock({
			name: req.body.name,
			index: req.body.index,
			price: req.body.price,
			history: req.body.history,
			lastTradingOption: req.body.lastTradingOption,
			lastTradingQuantity: req.body.lastTradingQuantity,
			//totalInventory: req.body.totalInventory,
			//lastTraded: req.body.lastTraded,
			tradingFee: req.body.tradingFee,
			rating: req.body.rating,
			data: req.body.data
			
		});
		
		if(!req.body.name) {
			res.status(400);
			res.send("Name is required.");
		}
		else {
			stock.save();
			res.status(201);
			res.send(stock);
		}
	};
	
	var get = function(req, res){

		//Will filter params of any chosen field
		//var query = req.query;

		//filters 'holding', sanitizing incorrect holding filters. (filters only checked fields, like holding)
		var query = {};
		if(req.query.holding)
		{
			query.holding = req.query.holding;
		}

		Stock.find(function(err, stocks){
			if(err)
			{
				res.status(500);
				res.send(err);
			}
			else
			{
				res.json(stocks);
			}
		});
	};
	
	var testMiddleware = function (req, res, next) {
		console.log("Test: running first middleware method, here is the date now: " + Date.now());
		next();
	};
	
	var findById = function(req, res, next){
		var param = {};

		if(typeof req.query.type === "undefined") {
			param._id = req.params.stockid;
		}
		else if(req.query.type === "index"){
			param.index = req.params.stockid;
		}
		else {
			param._id = req.params.stockid;
		}

		Stock.findOne(param, function(err, stock){
			if(err)
			{
				res.status(500);
				res.send(err);
			}
			else if(stock)
			{
				req.stock = stock;
				next();
			}
			else
			{
				res.status(404);
				res.send('No stock found...');
			}
		});
	}
	
	var getStockId = function(req, res){
		res.json(req.stock);
	};
	
	var putStockId = function(req, res){
		req.stock.name = req.body.name;
		req.stock.index = req.body.index;
		req.stock.price = req.body.price;
		req.stock.holding = req.body.holding;

		req.stock.save(function(err){
			if(err)
			{
				res.status(500);
				res.send(err);
			}
			else
			{
				res.json(req.stock);
			}
		});	

	};
	
	var patchStockId = function(req, res){
		if(req.body._id)
			delete req.body._id;

		for(var p in req.body)
		{
			req.stock[p] = req.body[p];
		}

		req.stock.save(function(err){
			if(err)
			{
				res.status(500);
				res.send(err);
			}
			else
			{
				res.json(req.stock);
			}
		});
	};
	
	var deleteStockId = function(req, res){
		req.stock.remove(function(err){
			if(err)
			{
				res.status(500);
				res.send(err);
			}
			else
			{
				res.status(204);
				res.send('Removed');
			}
		});
	};

	var findDashboardById = function(req, res, next){
		Dashboard.findOne({name: req.params.id}, function(err, dashboard){
			if(err)
			{
				res.status(500);
				res.send(err);
			}
			else if(dashboard)
			{
				req.dashboard = dashboard;
				next();
			}
			else
			{
				res.status(404);
				res.send('No dashboard found...');
			}
		});
	}

	var getDashboardById = function(req, res){
		console.log("getDashboardById method");
		res.json(req.dashboard);
	}

	var getArticles = function(req, res){
		var keywords = req.params.id;
		dataCollect.searchGoogleNews(keywords, function(articles){
			res.json({articles: articles});
			dataCollect.saveArticlesInDB(keywords, articles);
		});
	}

	var sendArticlesToPhone = function(req, res){
		var articles = req.dashboard.articles;
		var articleIndexes = [0,1,4,5];

		getAllContent(0);
		

		//recursive function
		function getAllContent(index){
			if(index >= articleIndexes.length){ res.status(200); res.send("Articles sent."); console.log("---Done sending Articles---"); return;}

			var link = articles[articleIndexes[index]].link;
			dataCollect.getArticleText(link, function(content){
				var text = 'Article title is: ' + articles[index].title + " Beginning of article: " + content;
				speech.text_to_speech(text , function(mediaURL){
					var body = req.dashboard.name + ": " + articles[index].title + " by " + articles[index].source + " on " + articles[index].date;
					phone.sendMMS(vars.myNum, body, vars.public_url + mediaURL, function(){
						console.log("Article sent");
						getAllContent(index + 1);
					});
				});
			});
		}
	}

	function getNewsArticlesFromSearchEngine(req, res){
		var params = 	{
							keywords: req.query.keywords,
							item_start: req.query.start,
							sort: req.query.sort
						}

		dataCollect.searchGoogleNews(params, sendArticles);

		function sendArticles(data, error){
			if(!error){
				res.status(200);
				res.json(data);
			}
			else{
				console.log("ERROR trying to send articles to client: " + JSON.stringify(error));
				res.status(500);
				res.send(error);
			}
		}
	}

	function saveArticles(req, res){
		Dashboard.findOne({name: req.body.name}, function(error, dashboard){
			if(error){
				res.status(500);
				res.send(err);
			}
			else if(dashboard){
				dashboard.articles = req.body.articles.concat(dashboard.articles);
				dashboard.save(function(err){
					if(err){
						console.log("ERROR: " + err);
						res.status(500);
						res.send(err);
					} 
					else{
						console.log("just saved");
						res.status(200);
						res.send();
					}
				});
			}
			else{
				var dashboard = new Dashboard({
					name: req.body.name,
					articles: req.body.articles
				});
				dashboard.save(function(err){
					if(err){
						console.log("ERROR: " + err);
						res.status(500);
						res.send(err);
					} 
					else{
						res.status(200);
						res.send();
					}
				});
			}
		});
	};

	function getArticlesText(req, res){
		console.log("Inside getArticlesText");
		var articles = req.body.articles,
			length = articles.length;

		getTextPerArticle(0);

		function getTextPerArticle(index){

			console.log("Inside getTextPerArticle, total of 10 here is the index: " + index);

			if(index == length){
				res.status(200);
				res.json({data: articles});
				return;	
			} 

			dataCollect.getArticleText(articles[index].link, function(content){
				articles[index].content = content;
				getTextPerArticle(index+1);
			});
		}
	}

	function getSimulations(req, res){
		
		console.log("In get simulation, server side.");

		Simulation.find(function(err, simulations){
			if(err)
			{
				res.status(500);
				res.send(err);
			}
			else
			{
				res.json(simulations);
			}
		});
	}

	function createSimulation(req, res){
		//To be worked on....
		console.log("Create a simulation");

		var simulation = new Simulation({
			name: req.body.name,
			stock_value: 0,
			stocks: req.body.stocks,
			available_cash: req.body.available_cash,
			initial_amount: req.body.available_cash
		});
		
		if(!req.body.name) {
			res.status(400);
			res.send("Name is required.");
		}
		else {
			simulation.save(function(error, stock){
				if(error) console.log("error: " + JSON.stringify(error));
			});
			res.status(201);
			res.send(simulation);
		}
	}

	function findSimulationById(req, res, next){
		Simulation.findOne({_id: req.params.simulationid}, function(err, simulation){
			if(err)
			{
				res.status(500);
				res.send(err);
			}
			else if(simulation)
			{
				req.simulation = simulation;
				next();
			}
			else
			{
				res.status(404);
				res.send('No simulation found...');
			}
		});
	}

	function getSimulationById(req, res){
		if(req.simulation.stocks.length > 0){
			var stocks = [];
			req.simulation.stocks.forEach(function(item){
				stocks.push(item.name);
			});

			//Get stock value and stock details
			yahooFinance.snapshot({
			  symbols: stocks,
			  fields: ['s', 'n', 'd1', 'l1', 'y', 'r'] 
			}, function (err, snapshot) {
					var stockValue = 0;
					for(var i = 0; i < snapshot.length; i++){
						stockValue += (req.simulation.stocks[i].quantity * snapshot[i].lastTradePriceOnly);
					}

					req.simulation.stock_value = stockValue;
					res.json(req.simulation);
				});
		}
		else{
			res.json(req.simulation);
		}
	}
	
	function updateSimulation(req, res){
		console.log("TRADE DETAILS UPDATE: " + JSON.stringify(req.body));

		var last_transaction = req.body.transaction_history[req.body.transaction_history.length - 1],
			action = last_transaction.action,
			order_type = last_transaction.order_type,
			name = last_transaction.name,
			price = last_transaction.price,
			action_price = last_transaction.action_price,
			trailing_percentage = last_transaction.trailing_percentage,
			tariling_amount = last_transaction.tariling_amount,
			quantity = last_transaction.quantity;

		//Order Types
		if(action === "sell"){
			if(order_type === "market"){
				yahooFinance.snapshot({
				  symbols: [name],
				  fields: ['s', 'n', 'd1', 'l1', 'y', 'r'] 
				}, function (err, snapshot) {
						price = snapshot.lastTradePriceOnly;
						last_transaction.price = price;
						
						//Artificial lag, assuming stock is very liquidable
						setTimeout(trade, 2 * 1000);
						function trade(){
							req.simulation.available_cash = req.body.available_cash + (price*quantity);
							for(var i = 0; i < req.body.stocks.length; i++){
								if(req.body.stocks[i].name === name){
									req.body.stocks.quantity -= quantity;
									if(req.body.stocks.quantity == 0) req.body.stocks.splice(i, 1);
									break;
								}
							}
							saveTrade();
						}
					});
			}
			else if(order_type === "limit"){

			}
			else if(order_type === "stop_limit"){
				
			}
			else if(order_type === "stop_market"){
				
			}
			else if(order_type === "trailing_stop_amt"){
				
			}
			else if(order_type === "trailing_stop_perc"){
				
			}
		}
		else if(action === "buy"){
			if(order_type === "market"){
				yahooFinance.snapshot({
				  symbols: [name],
				  fields: ['s', 'n', 'd1', 'l1', 'y', 'r'] 
				}, function (err, snapshot) {
						price = snapshot.lastTradePriceOnly;
						last_transaction.price = price;

						//Artificial lag, assuming stock is very liquidable
						setTimeout(trade, 3 * 1000);
						function trade(){
							req.simulation.available_cash = req.body.available_cash - (price*quantity);
							var i = 0;
							for(; i < req.body.stocks.length; i++){
								if(req.body.stocks[i].name === name){
									req.body.stocks.quantity += quantity;
									break;
								}
							}

							//If stock not currently in the list than add it
							if(i === req.body.stocks.length){
								req.body.stocks.push({
									name: name,
									price: price,
									quantity: quantity
								});
							}
							saveTrade();
						}
					});
			}
			else if(order_type === "limit"){

			}
			else if(order_type === "stop_limit"){
				
			}
			else if(order_type === "stop_market"){
				
			}
			else if(order_type === "trailing_stop_amt"){
				
			}
			else if(order_type === "trailing_stop_perc"){
				
			}
		}
		else if (action === "buy_to_cover"){
			if(order_type === "market"){

			}
			else if(order_type === "limit"){

			}
			else if(order_type === "stop_limit"){
				
			}
			else if(order_type === "stop_market"){
				
			}
			else if(order_type === "trailing_stop_amt"){
				
			}
			else if(order_type === "trailing_stop_perc"){
				
			}
		}
		else if(action === "sell_short"){
			if(order_type === "market"){

			}
			else if(order_type === "limit"){

			}
			else if(order_type === "stop_limit"){
				
			}
			else if(order_type === "stop_market"){
				
			}
			else if(order_type === "trailing_stop_amt"){
				
			}
			else if(order_type === "trailing_stop_perc"){
				
			}
		}

		function saveTrade(){
			req.simulation.transaction_history = req.body.transaction_history;
			req.simulation.stocks = req.body.stocks;

			if(req.simulation.stocks.length > 0){
				var stocks = [];
				req.body.stocks.forEach(function(item){
					stocks.push(item.name);
				});

				yahooFinance.snapshot({
				  symbols: stocks,
				  fields: ['s', 'n', 'd1', 'l1', 'y', 'r'] 
				}, function (err, snapshot) {
						var stockValue = 0;
						for(var i = 0; i < snapshot.length; i++){
							stockValue += (req.simulation.stocks[i].quantity * snapshot[i].lastTradePriceOnly);
						}
						req.simulation.stock_value = stockValue;
						saveSimulation();
					});
			}
			else {
				req.simulation.stock_value = req.simulation.available_cash;
				saveSimulation();
			}
			
			function saveSimulation(){
				req.simulation.save(function(err){
					if(err)
					{
						res.status(500);
						res.send(err);
					}
					else
					{
						res.json(req.simulation);
					}
				});
			}
		}	
	}

	function getData(req, res){
		var stocks = [],
			obj = {};

		if(req.body.stocks.length < 1){
			obj.stock_value = 0;
			res.json(obj);
		}
		else{
			req.body.stocks.forEach(function(item){
				stocks.push(item.name);
			});
			yahooFinance.snapshot({
			  symbols: stocks,
			  fields: req.body.params 
			}, function (err, snapshot) {
					var stockValue = 0;

					for(var i = 0; i < snapshot.length; i++){
						stockValue += (req.body.stocks[i].quantity * snapshot[i].lastTradePriceOnly);
					}

					obj.stock_value = stockValue;
					res.json(obj);
				});
		}
	}

	return {
		post: post,
		get: get,
		findById: findById,
		testMiddleware: testMiddleware,
		getStockId: getStockId,
		putStockId: putStockId,
		patchStockId: patchStockId,
		deleteStockId: deleteStockId,
		findDashboardById: findDashboardById,
		getDashboardById : getDashboardById,
		getArticles: getArticles,
		sendArticlesToPhone: sendArticlesToPhone,
		getNewsArticlesFromSearchEngine: getNewsArticlesFromSearchEngine,
		saveArticles: saveArticles,
		getArticlesText: getArticlesText,
		getSimulations: getSimulations,
		createSimulation: createSimulation,
		findSimulationById: findSimulationById,
		updateSimulation: updateSimulation,
		getSimulationById: getSimulationById,
		getData: getData
	};
};

module.exports = stockController;