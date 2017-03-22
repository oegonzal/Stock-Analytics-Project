(function() {
	"use strict";
	
	var module = angular.module("psOptimize");
	
	module.component("stockDelete", {
		templateUrl: '/app/components/investing/stock/stock-delete.component.html',
		controllerAs: "model",
		bindings: {
			"$router": "<"	
		},
		controller: ["api", function(api) {
			var model = this;
			
			model.$routerOnActivate = function(next, previous) { //next: route going to, pre: route from
				console.log(next);
				model.id = next.params.id;
			};
			
			model.remove = function() {
				api.stock.remove({id:model.id},
					function(stock){
						console.log('Stock ' + model.id + ' deleted.');
						model.$router.navigate(["StockList"]);
					},
					function(stock){
						console.log('Error deleting stock.');
					}
				);
			};
		}]
	});
	
}());
