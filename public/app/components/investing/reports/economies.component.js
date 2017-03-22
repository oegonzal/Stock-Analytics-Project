(function() {
	"use strict";
	
	var module = angular.module("psOptimize");
	
	module.component("economiesPage", {
		templateUrl: "/app/components/investing/reports/economies.component.html",
		controllerAs: "vm",
		controller: ["api", controller],
		bindings: {
			"$router": "<"
		}
	});

	function controller(api){
		var vm = this;
		vm.imagePathForSim = 'assets/img/ic_format_align_justify_black_24px.svg';
		vm.simulations = [{},{}];
	};
	
}());
