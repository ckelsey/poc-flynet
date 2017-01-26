(function(app){
	'use strict';
	app.config(function ($stateProvider, $urlRouterProvider, $routeProvider, $locationProvider) {

		$routeProvider
		.when(location.pathname, {
			title: 'Editor',
			templateUrl: 'editor.html'
		});

		$locationProvider.html5Mode(true);
	});

	app.controller('AppCtlr', function($rootScope){
		var self = this;

		console.log('E1');

		$rootScope.pageTitle = 'Presentation Builder';
	});
})(angular.module('app', [
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'templatesModule',
	'stylingModule',
	'elementsModule',
	'editorView',
	'dataShare',
	'sidebarModule',
	'ui.router'
]));
