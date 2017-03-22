(function() {
	"use strict";
	
	var module = 
		angular.module("psOptimize", ["ngComponentRouter", "ngResource", "ngMaterial", "ngAnimate" /*,"react"*/ ])
	
		.config(["$locationProvider", "$resourceProvider", function($locationProvider, $resourceProvider) {
			$locationProvider.html5Mode(true);
			$resourceProvider.defaults.stripTrailingSlashes = false;
		}])
	
		.value("$routerRootComponent", "viewPage");
	
}());
