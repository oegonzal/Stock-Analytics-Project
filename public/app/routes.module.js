(function(){
	"use strict";
	
	var module = angular.module("psOptimize");
	
	module.component("viewPage", {
		template: '<ng-outlet></ng-outlet>',
		$routeConfig: [
			{ path: "/home", 						component: "homeApp", 			name: "Home", useAsDefault: true },
			{ path: "/investing/...", 				component: "investApp", 		name: "Invest" },
			{ path: "/blog/...", 					component: "blogApp", 			name: "Blog" },
			{ path: "/**", 															redirectTo: ["Home"] }
		]
	});
 
	module.component("investApp", {
		templateUrl: "/app/components/investing/dashboard/invest.component.html",
		$routeConfig: [
			{ path: "/dashboard", 				component: "investDashboard", 	name: "InvestDashboard", useAsDefault: true },
			//{ path: "/list", 					component: "stockList", 		name: "List" },
			{ path: "/detail/:id/...", 			component: "stockDetail", 		name: "StockDetail" },
			{ path: "/screen", 					component: "screenPage", 		name: "Screen" },
			{ path: "/simulation/...", 			component: "simulationPage",	name: "Simulation" },
			{ path: "/graph", 					component: "graphPage", 		name: "Graph" },
			{ path: "/watchlist",				component: "watchlist", 		name: "Watchlist" },
			{ path: "/stock/...", 				component: "stockPage",			name: "Stock" },
			{ path: "/gold", 					component: "goldPage",			name: "Gold" },
			{ path: "/oil", 					component: "oilPage",			name: "Oil" },
			{ path: "/**", 														redirectTo: ["InvestDashboard"] }
		]
	});

	//Simulation Page component routes
	module.component("simulationPage", {
		template: '<ng-outlet></ng-outlet>',
		$routeConfig: [
			{ path: "/simulationlist", 	component: "simulationListPage",		name: "SimulationList", useAsDefault: true },
			{ path: "/trade/:id",		component: "simulationTradePage",  	 	name: "SimulationTrade" },
			//{ path: "/history/:id",	 component: "simulationHistoryPage", 		name: "SimulationHistory" }
		]
	});

	//Stock Page component routes
	module.component("stockPage", {
		template: '<ng-outlet></ng-outlet>',
		$routeConfig: [
			{ path: "/stocklist",	 	component: "stockList", 		name: "StockList", useAsDefault: true },
			{ path: "/create",	 		component: "stockCreate", 		name: "StockCreate" },
			{ path: "/edit/:id",	 	component: "stockEdit", 		name: "StockEdit" },
			{ path: "/detail/:id/...",	component: "stockDetail", 		name: "StockDetail" },
			{ path: "/delete/:id",		component: "stockDelete",	 	name: "StockDelete" }
		]
	});

	module.component("blogApp", {
		templateUrl: '/app/components/blogging/blog.component.html',
		$routeConfig: [
			{ path: "/main", 						component: "blogPage", 			name: "Bloghome", useAsDefault: true },
			{ path: "/**", 															redirectTo: ["Bloghome"] }
		]
	});
	
}());