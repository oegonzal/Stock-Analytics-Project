(function (angular) {
    'use strict';
	
	//This one goes on <ul> that forms side-bar
	angular
    .module('psOptimize')
    .directive('ngMetis', ["$timeout", function($timeout) {
        
        // ======================================
        // == DIRECTIVE DEFINITION
        // ======================================
        var directive = {
            restrict: 'A',
            link: function(scope, el, atts) {
                //console.log("----- element is: " + JSON.stringify(el)); 
                $timeout(function () {
                    angular.element(el).metisMenu();
                }, 0);             
            }
        };
        
        return directive;        
    }]);
})(angular);