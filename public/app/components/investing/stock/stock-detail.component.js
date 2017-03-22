(function() {	
	"use strict";
	
	var module = angular.module("psOptimize");
	
	module.component("stockDetail", {
		templateUrl: "/app/components/investing/stock/stock-detail.component.html",
		//$canActivate: function($timeout) {
			//return false; //Will not allow this to activate so route is inactive	
			//return $timeout(function() {
			//	return true;
			//}, 2000);
		//},
		$routeConfig: [
			{ path: "/overview", 		component: "stockOverview", 	name: "Overview" },
			{ path: "/history", 		component: "stockHistory", 		name: "History" },
			{ path: "/suggestion", 		component: "stockSuggestion", 	name: "Suggestion"}
		],
		controllerAs: "model",
		controller: function() {
			var model = this;
			
			model.$routerOnActivate = function(next, previous) { //next: route going to, pre: route from
				console.log(next);
				model.id = next.params.id;
			};
		}
	});
	
	module.component("stockOverview", {
		template: "This is the stock overview page will will show current trading strategies."
	});
	
	
	module.component("stockHistory", {
		template: "This is the stock history and it will show all history related to stocks in the past for this account."
	});
	
	module.component("stockSuggestion", {
		template: "This is the stock suggestion page which will show which stocks this account should trade according to current criteria and trading strategies."
	});
	
}());


/*
	Life Cycle Hooks:
	$canAcivate
	$routerOnActivate
	$routerCanDeactive
	$routerOnDeactivate
	$routerCanReuse
*/