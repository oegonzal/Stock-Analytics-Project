(function(){
	"use strict";
	
	var module = angular.module("psOptimize");
	
	module.component("homeApp", {
		templateUrl: "/app/components/home/dashboard/dashboard.component.html"
	});
	
	module.component("landingPage", {
		template: "This is the home page. This should be what shows in the home dashboard. Here is is after the update"
	});
	
}());