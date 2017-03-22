(function(){
	"use strict";
	
	var module = angular.module("psOptimize");
	
	module.component("blogPage", {
		templateUrl: "/app/components/blogging/posts/main.component.html",
		controllerAs: "vm",
		controller: ['api', controller],
		bindings: {
			"$router": "<"
		}
	});
	
	module.component("blogContent", {
		template: "This is the home page. This should be what shows in the home dashboard. Here is is after the update"
	});
	
	function controller(api){
		var vm = this;

		vm.$onInit = function() {
			api.blog.query()
				.$promise
				.then(function(blogs){
					vm.blogs = flipArray(blogs);
				})
		}

		vm.savePost = function(){
			api.blog.create(vm.newBlog)
				.$promise
				.then(function(response){
					console.log(JSON.stringify(response.status));
				});
		}

		function flipArray(array){
			var length = array.length;

			for(var i = 0; i < (length - 1)/2; i++){
				var temp = array[i];
				array[i] = array[length - i - 1];
				array[length - i -1] = temp;
			}
			return array;
		}
	}
}());