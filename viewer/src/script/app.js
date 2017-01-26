(function(app){
	'use strict';
	app.config(function ($stateProvider, $urlRouterProvider, $routeProvider, $locationProvider) {

		$routeProvider
		.when(location.pathname, {
			templateUrl: "viewer.html",
			controller: 'AppCtlr',
		});


		$locationProvider.html5Mode(true);
	});

	app.controller('AppCtlr', function(){
		var self = this;

		console.log('V1');
	});
})(angular.module('app', [
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'presentationRender',
	'viewerView',
	'dataShare',
	'ui.router'
]));
