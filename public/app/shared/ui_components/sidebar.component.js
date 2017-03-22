(function() {
	"use strict";
	
	var module = angular.module("psOptimize");

	module.component("sidebar", {
		templateUrl: "/app/shared/ui_components/sidebar.component.html",
		controllerAs: "vm",
		bindings: {
		    options: '='
		},
		controller: ['$scope', controller]
	});
	
	function controller($scope) {
		var vm = this;

		//@param for options eg) vm.options = [{urlName: 'Invest', text: 'Go to Stock Page', icon: 'fa-dashboard' }, ... ,{...},{...}]
		//console.log(JSON.stringify(vm.options));
	}
	
}());