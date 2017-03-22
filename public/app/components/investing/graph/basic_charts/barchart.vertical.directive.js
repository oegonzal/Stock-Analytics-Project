(function() {
	"use strict";
	
	var module = angular.module("psOptimize");
	
	module.directive('barChartVertical', function () {
		return {
			restrict: 'E',
			replace: 'false',
			scope: { 
				data: '=chartData' 
			},
			link: function (scope, element, attrs) {
				
				var w = 300;
				var h = 100;
				var padding = 2;
				var dataset = [5,10,15,20,25, 10, 8, 21, 18];

				var svg = 
						d3.select(element[0]).append("svg")
							.attr("width", w)
							.attr("height", h);

				function colorPicker(v) {
					if(v<=20) {return "#666666"; }
					else if(v>20) {return "#FF0033"; }
				}

				svg.selectAll("rect")
					.data(dataset)
					.enter()
					.append("rect")
						.attr({
							x: function(d, i ) {return i * (w / dataset.length);},
							y: function(d){ return h - (d*4);},
							width:  w / dataset.length - padding,
							height: function(d) {return d*4;},
							fill: function(d) { return "rgb(" + (d*10) + ", 0, 0)";}
						});


				svg.selectAll("text")
					.data(dataset)
					.enter()
					.append("text")
					.text(function (d) {return d;})
					.attr({
						"text-anchor": "middle",
						x: function(d, i) {return i * (w / dataset.length) + (w / dataset.length - padding)/2;},
						y: function(d) {return h - (d*4) + 14; },
						"font-family": "sans-serif",
						"font-size": 12,
						"fill": "#ffffff"
					});
			}
		};
	});
	
}());