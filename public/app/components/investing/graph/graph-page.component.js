(function() {
	"use strict";
	
	var module = angular.module("psOptimize");

	module.component("graphPage", {
		templateUrl: "/app/components/investing/graph/graph-page.component.html",
		controller: ['$scope', controller],
		controllerAs: 'vm'
	});
	
	function controller($scope) {
		var vm = this;

		vm.getCharts = function(){
			console.log("getCharts method clicked");
		}

		/*
			Next: 
			1. Find a way to update these on the same page and generate new index charts on the spot
				-Make a master file, with all the actual indicators i will use inherited, and make it anonymous function in index
				-then use a query string to put on the html tag here
			2. Find a way to put the indicators on the same page
				-To switch back and forth will be hard bc you cannot manipulate static code.
				-Find a dynamic code generator
			3. Add more indicators (figure out how this library works so you can make your own)

			Make Simulations
			-Diff account with diff stock holdings
			-Account balance (start with 3k)
			-Have different strategies in each

			Have one to one mapping:
			-Web scrape/or enter a list of stocks
			-back track them and generate an article of them on good days and bad days
			-get near breakout charts and make alert system.
			-display breakout charts on my dash
			-Alerts on stock at there support level (so i can long them)

			Backtrack a stock to find probability it will go up/down during the next few days

			Motivation: 	http://seekingalpha.com/article/4022446-lose-money-stock-market
			
		*/

		$scope.chartOptions = 
			{
				stock: 		'AAPL',
				index: 		'AAPL',
				start: 		1,
				end: 		1,
				range: 		100,
				eMovAvg1: 	1,
				eMovAvg2: 	1,
				sMovAvg: 	1,
				macDFast: 	1,
				macDSlow: 	1,
				macDSignal: 1,
				rsi: 		1,
				atr: 		1,
				stoSlow: 	1,
				stoFast: 	1,
				stoFull: 	1,
				bollRange: 	1,
				bollSD: 	1,
				compIndexs: 1, 
				forceInd1: 	1,
				forceInd2: 	12
 			};
	}
}());