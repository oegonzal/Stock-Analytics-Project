(function() {
	"use strict";
	
	var module = angular.module("psOptimize");
	
	module.factory('api', ['$resource', '$http', function ($resource, $http) {
			
			
			function getBasicResource(path) {
				return $resource( path, {id:'@id'}, {
							query	: { method: "GET", isArray: true },
							get		: { method: "GET"},
							create	: { method: "POST"},
							save	: { method: "POST"},
							delete	: { method: "DELETE"},
							remove	: { method: "DELETE"},
							update	: { method: "PUT"},
							post 	: { method: 'POST'}
						});
			}

			function http(options){
				return $http(options);
			}
		
			var API = {
				http: http,
				stock: getBasicResource('/api/investing/stock/:id'),
				dashboard: getBasicResource('/api/investing/dashboard/:id'),
				articles: getBasicResource('/api/investing/articles/:id'),
				sendArticlesTextToSpeech: getBasicResource('/api/investing/dashboard/:id/sendArticles'),
				history: getBasicResource('http://marketdata.websol.barchart.com/getHistory.json?key=8bf7f31c837e6b14704f36bcee1d3414&symbol=IBM&type=daily&startDate=20150503000000'),
				saveArticles: getBasicResource('/api/investing/save-articles'),
				getArticlesText: getBasicResource('/api/investing/get-articles-text'),
				blog: getBasicResource('/api/blog'),
				simulation: getBasicResource('/api/investing/simulation/:id')
			};
			
			return API;
	}]);
}());