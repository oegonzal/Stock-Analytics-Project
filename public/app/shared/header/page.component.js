(function() {
	"use strict";
	
	var module = angular.module("psOptimize");

	module.component("pageHeader", {
		templateUrl: "/app/shared/header/page.component.html",
		bindings: {
			"$router": "<"
		},
		controllerAs: "vm",
		controller: controller,
		transclude: true,
	});

	function controller(){

	}
	
}());