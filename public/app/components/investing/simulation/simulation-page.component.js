(function() {
	"use strict";
	
	var module = angular.module("psOptimize");
	
	module.component("simulationListPage", {
		templateUrl: "/app/components/investing/simulation/simulation-page.component.html",
		controllerAs: "vm",
		controller: ["api", "$timeout", "$q", "$log", controller],
		bindings: {
			"$router": "<"
		}
	});

	function controller(api, $timeout, $q, $log){
		var vm = this;
		vm.imagePathForSim = 'assets/img/ic_format_align_justify_black_24px.svg';
		vm.newSimulation = {name:"", stocks:[]};

		vm.$routerOnActivate = function(next, previous) {
			api.http({method: 'GET', url: '/api/investing/simulation'})
				.then(function(response){
					vm.simulations = response.data;
				});
		}

		vm.saveSimulation = function(){
			api.simulation.save(vm.newSimulation,
				function() { console.log('Simulation saved'); },
				function() { console.log('Simulation could not be saved'); }
			).$promise.then(function(response){
				console.log(response);
			});
		}

		vm.addStock = function(){
			console.log("Adding a stock");
			vm.newSimulation.stocks.push({});
		}

		vm.goToTrade = function(id){
			console.log(id);
			vm.$router.navigate(["SimulationTrade", {id:id}]);
		}

		vm.goToHistory = function(id){
			//vm.$router.navigate(["SimulationHistory", {id:id}]);
		}
	};
	
}());
