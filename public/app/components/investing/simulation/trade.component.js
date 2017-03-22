(function() {
	"use strict";
	
	var module = angular.module("psOptimize");
	
	module.component("simulationTradePage", {
		templateUrl: "/app/components/investing/simulation/trade.component.html",
		controllerAs: "vm",
		controller: ["api", controller],
		bindings: {
			"$router": "<"
		}
	});

	/*
		Plan:
		Add stock details
		Ratio of successful trades
		average earning per trade per time period
		Number of trades in a given period

	*/
	//https://greenido.wordpress.com/2009/12/22/work-like-a-pro-with-yahoo-finance-hidden-api/
	function controller(api){
		var vm = this;

		vm.$routerOnActivate = function(next, previous) {
			vm.id = next.params.id;
			api.simulation.get( {id:vm.id},
						function() {console.log("Success retrieving item");},
						function() {console.log("Failed to retrieve item");}
					)
					.$promise
					.then(function(response) {
						vm.simulation = response;
						vm.simulateQuery = false;
					    vm.isDisabled    = false;
					    vm.stocks        = loadAll(vm.simulation.stocks);
					    vm.querySearch   = querySearch;
					    vm.selectedItemChange = selectedItemChange;
    					vm.searchTextChange   = searchTextChange;
					    vm.newStock = newStock;

					    console.log("Initial information for this simulation: " + JSON.stringify(response));
					});
		}

		vm.updateAccountValue = function(){
			api.http({
						method: "POST", 
						url: "/api/investing/yahoo-api", 
						data: { 
								params: ['s', 'n', 'd1', 'l1', 'y', 'r'], 
								stocks: vm.simulation.stocks, 
								available_cash: vm.simulation.available_cash
							  }
					})
					.then(function(response){
						console.log("Response for stock data is: " + JSON.stringify(response));
						vm.simulation.stock_value = response.data.stock_value;
					});
		}

		vm.executeTrade = function(){
			
			var chosen_stock = vm.chosen_stock;
			if(vm.chosen_stock !== null && typeof vm.chosen_stock.display !== 'undefined') chosen_stock = vm.chosen_stock.display;

			vm.simulation.transaction_history.push(
				{ 
					date: Date(),
					action: vm.action,
					order_type: vm.order_type,
					action_price: vm.action_price,
					trailing_percentage: vm.trailing_percentage,
					tariling_amount: vm.tariling_amount,
					name: vm.chosen_stock,
					price: vm.price,
					quantity: vm.quantity
				});

			vm.simulation.$update( { id:vm.id }, success, error );
			
			function success(stock){
				console.log('Stock edited: ' + JSON.stringify(stock)); 	
				//vm.$router.navigate(["SimulationList"]);
				//Reload page
			};
			
			function error(stock){
				console.log('Error updating stock');
			};
		}

		function newStock(state) {
	      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
	    }

	    function querySearch (query) {
	      var results = query ? vm.stocks.filter( createFilterFor(query) ) : vm.stocks,
	          deferred;
	      if (vm.simulateQuery) {
	        deferred = $q.defer();
	        $timeout(function () { deferred.resolve( results ); }, /*Math.random() * */ 1000, false);
	        return deferred.promise;
	      } else {
	        return results;
	      }
	    }

	    function searchTextChange(text) {
	    	//Execute when text changes in autocomplete text box
	    	vm.chosen_stock = text;
	    }

	    function selectedItemChange(item) {
	    	//Function executed when autocorrect changes value
	    }

	    /**
	     * Build `states` list of key/value pairs
	     */
	    function loadAll(stocks) {
	    	  //console.log(JSON.stringify(vm.simulation));
		      return stocks.map( function (stock) {
		        return {
		          value: stock.name,
		          display: stock.name
		        };
	      	  });
	    }

	    /**
	     * Create filter function for a query string
	     */
	    function createFilterFor(query) {
	      var lowercaseQuery = angular.lowercase(query);

	      return function filterFn(stock) {
	        return (stock.value.indexOf(lowercaseQuery) === 0);
	      };

	    }
	}

}());