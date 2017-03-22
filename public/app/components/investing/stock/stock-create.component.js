(function() {
	"use strict";
	
	var module = angular.module("psOptimize");
	
	function controller(api) {
		var model = this;

		model.save = function() {

			var newStock = 	{ 
								name				: model.name,
								index				: model.index,
								lastTradingOption	: model.option,
								price				: model.price,
								lastTradingQuantity	: model.quantity,
								history				: { 
														purchasedDate: Date.now,
														tradingOption: model.option,
														quantity: model.quantity
													  },
								data				: model.data
								//,tradingFee			: model.tradingFee,
								//rating				: model.rating
							};
			
			api.stock.save(newStock,
				function() { console.log('Stock saved'); },
				function() { console.log('Stock could not be saved'); }
			).$promise.then(checkStocks);
			
			function checkStocks(data) {
				console.log("Added Stock: " + data.name);
				model.stocks = api.stock.query();
				console.log(model.stocks);
				model.$router.navigate(["StockList"]);
			}
		}
	}
	
	module.component("stockCreate", {
		templateUrl: "/app/components/investing/stock/stock-create.component.html",
		controllerAs: "model",
		controller: ["api", controller],
		bindings: {
			"$router": "<"
		}
	});
	
}());