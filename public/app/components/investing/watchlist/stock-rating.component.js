(function(){
	"use strict";
	
	var module = angular.module("psOptimize");
	
	function buildEntries(value, max) {
		var entries = [];
		
		for(var i = 1; i <= max; i++) {
			var icon = i <= value ? "glyphicon-star" : "glyphicon-star-empty";
			entries.push(icon);
		}
		
		return entries;
	}
	
	module.component("stockRating", {
		templateUrl: "/app/components/investing/watchlist/stock-rating.component.html",
		bindings: {
			value: "<", 	// '<' input binding, '@' attributes, '&' function bindings to parent, 
			max: "<",  		// '=' 2 way bindingy. Also available for isolated scopes
			setRating: "&" 	//think of public api for this component
		},
		//transclude: true,
		controllerAs: "model",
		controller: function() {
			var model = this;
			
			model.$onInit = function() {
				model.entries = buildEntries(model.value, model.max);
			};
			
			model.$onChanges = function() {
				model.entries = buildEntries(model.value, model.max);
			};
		}
	});
}());