(function() {
	"use strict";
	
	var module = angular.module("psOptimize");

	//Stock list component
	module.component("stockList", {
		templateUrl: "/app/components/investing/stock/stock-list.component.html",
		controllerAs: "model",
		controller: ["api", controller],
		bindings: {
			"$router": "<"	//access to current router. (There are a hiearchy of routers)
		}
	});
	
	function controller(api) {
		var model = this;
		model.stocks = [];
		
		model.$onInit = function() {
			api.stock.query().$promise.then(function(stocks) {
				model.stocks = stocks;
			});

			/*
			var onDemand = new OnDemandClient();
			onDemand.setAPIKey('change-me');
			onDemand.setJsonP(true);
			onDemand.getQuote({symbols: 'AAPL,GOOG'}, function (err, data) {
			        var quotes = data.results;
			        for (x in quotes) {
			            console.log("getQuote: " + quotes[x].symbol + " [" + quotes[x].name + "] = " + JSON.stringify(quotes[x]));
			        }
			});
			*/
		};
		
		model.goToDetail = function(id) {
			model.$router.navigate(["StockDetail", {id:id}, "Overview"]);
		};
		
		model.goToDelete = function(id) {
			model.$router.navigate(["StockDelete", {id:id}]);
		};
		
		model.goToEdit = function(id) {
			model.$router.navigate(["StockEdit", {id:id}]);
		};
		
		model.goToCreate = function() {
			model.$router.navigate(["StockCreate"]);
		};
	}
}());