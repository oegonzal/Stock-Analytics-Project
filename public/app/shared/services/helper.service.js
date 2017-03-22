(function() {
	"use strict";
	
	var module = angular.module("psOptimize");
	
	module.factory('helperService', function () {
		
		function flipArray(array){
			var length = array.length;

			for(var i = 0; i < (length - 1)/2; i++){
				var temp = array[i];
				array[i] = array[length - i - 1];
				array[length - i -1] = temp;
			}
			return array;
		}

		var Helper = {
			flipArray: flipArray,
			tester: function(){ console.log("From helper service"); }
		};

		return Helper;	
	});
}());