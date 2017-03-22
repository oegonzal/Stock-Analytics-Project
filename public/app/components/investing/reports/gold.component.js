(function() {
	"use strict";
	
	var module = angular.module("psOptimize");
	
	module.component("goldPage", {
		templateUrl: "/app/components/investing/reports/gold.component.html",
		controllerAs: "vm",
		controller: ["api", "$window", "$interval", controller],
		bindings: {
			"$router": "<"
		}
	});

	function controller(api, $window, $interval){
		var vm = this;
		vm.articles = [];
		vm.imagePathForSim = 'assets/img/ic_format_align_justify_black_24px.svg';
		vm.imageText = 'assets/img/ic_message_black_24px.svg'

		var timeInMins = 15;
		$interval(function(){
			console.log(timeInMins + " mins have passed");
            api.http({method: 'GET', url: '/api/investing/get-articles?keywords='+ vm.keywords + '&sort=' + vm.sort +'&start=' + vm.start})
            	.then(cacheArticlesNextSet);   
         }, timeInMins * 60 * 1000);

		vm.$routerOnActivate = function(next, previous) { //next: route going to, pre: route from
			vm.keywords = 'Gold Price';
			vm.sort = 'sbd';
			vm.start = 0;

			api.http({method: 'GET', url: '/api/investing/get-articles?keywords='+ vm.keywords + '&sort=' + vm.sort +'&start=' + vm.start})
				.then(cacheArticles);
		}

		vm.goToArticle = function(url){
			console.log(url);
			$window.open(url, '_blank');
		}

		vm.sendArticlesTextToSpeech = function(){
			api
			.sendArticlesTextToSpeech
			.get({id: vm.id}, success, error);
		}

		vm.saveArticles = function(){
			var selected = [];
			angular.forEach(vm.articles, function(value, key){
				if(value.selected === true){
					selected.push(value);
				}
			});

			var data = {name: vm.keywords, articles: selected};
			api.saveArticles.post(data, success, error);
		}

		vm.getArticlesText = function(){
			var data = {articles: vm.articles};
			api.getArticlesText.post(data).$promise.then(cacheArticlesForText);
		}

		vm.showArticleText = function(index){
			vm.current_content = vm.articles[index].content;
		}

		function cacheArticles(response){
			vm.articles = response.data;
			vm.getArticlesText();
		}

		function cacheArticlesForText(response){
			vm.articles = response.data;
		}

		function success(response){
			console.log("Response returned successfully");
		}

		function error(response){
			console.log("ERROR " + JSON.stringify(response.data.message) + " response could not be recieved, please check error log." );
		}

		function response(dashboard){
			vm.articles = dashboard.articles;
		}
		function getArticles(){
			//console.log("ERROR getting articles. Trying again...");
			api.http({method: 'GET', url: '/api/investing/get-articles?keywords='+ vm.keywords + '&sort=' + vm.sort +'&start=' + vm.start})
				.error(getArticles)
				.success(function(){console.log("Successfully retrieved articles after error");});
		}
	};
	
}());
