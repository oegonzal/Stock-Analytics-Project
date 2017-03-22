(function() {
	"use strict";
	
	var module = angular.module("psOptimize");
	
	function fetchStocks($http) {
		return $http.get("/app/components/investing/watchlist/stocks.json")
				.then(function(response) {
					return response.data;
				});
	}
	
	function controller($http) {
		var model = this;
		model.stocks = [];
		
		model.$onInit = function() {
			fetchStocks($http).then(function(stocks) {
				model.stocks = stocks;
			});
		};
		
		model.goTo = function(id) {
			model.$router.navigate(["StockDetail", {id:id}, "Overview"]);
		};
		
		model.setRating = function(stock, newRating) {
			stock.rating = newRating;
		};
		
		model.upRating = function(stock) {
			if(stock.rating < 5) {
				stock.rating += 1;
			}
		};
		
		model.downRating = function(stock) {
			if(stock.rating > 1) {
				stock.rating -= 1;
			}
		}
	}
	
	module.component("watchlist", {
		templateUrl: "/app/components/investing/watchlist/watchlist-page.component.html",
		controllerAs: "model",
		controller: ["$http", controller],
		bindings: {
			"$router": "<"	//access to current router. (There are a hiearchy of routers)
		}
	});
	
}());