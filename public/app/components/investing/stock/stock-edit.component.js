(function() {
	"use strict";
	
	var module = angular.module("psOptimize");
	
	function controller(api) {
		var model = this;
		
		model.$routerOnActivate = function(next, previous) { //next: route going to, pre: route from
				model.id = next.params.id;
			
				api.stock.get( {id:model.id},
						function() {console.log("Success retrieving item");},
						function() {console.log("Failed to retrieve item");}
					)
					.$promise
					.then(function(stock) {
						model.name = stock.name;
						model.index = stock.index;
						model.option = stock.option;
						model.price = stock.price;
						model.quantity = stock.lastTradingQuantity;
					
						console.log(JSON.stringify(stock));
					});
				
			};
		
		model.edit = function() {
			console.log("id is: " + model.id);
			StockService.get({ id:model.id }, function(stock) {
				
				stock.name = model.name;
				stock.index = model.index;
				stock.option = model.option;
				stock.price = model.price;
				stock.quantity = model.quantity;
				
				stock.$update( { id:model.id }, success, error );
				
				function success(stock){
					console.log('Stock edited: ' + JSON.stringify(stock)); 	
					model.$router.navigate(["StockList"]);
				};
				
				function error(stock){
					console.log('Error updating stock');
				};
			});
			//.$promise		//Why is this promise not updating right before the redirect?
			//.then((model.$router.navigate(["StockList"])););
		}
	}
	
	module.component("stockEdit", {
		templateUrl: '/app/components/investing/stock/stock-edit.component.html',
		controllerAs: "model",
		controller: ["api", controller],
		bindings: {
			"$router": "<"
		}
	});
	
}());
