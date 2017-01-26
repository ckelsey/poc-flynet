(function(app){
	'use strict';
	app.config(function ($routeProvider, $locationProvider) {

		$routeProvider
		// .when(location.pathname, {
		// 	title: 'Project',
		// 	templateUrl: "viewer.html",
		// 	controller: 'ViewerCtlr',
		// })
		// .when(location.pathname + '/edit', {
		// 	title: 'Editor',
		// 	templateUrl: 'editor.html',
		// 	controller: 'EditorViewCtlr'
		// });

		.when('/', {
			title: 'Project',
			templateUrl: "viewer.html",
			// controller: 'ViewerCtlr',
		})
		.when('/edit', {
			title: 'Editor',
			templateUrl: 'editor.html',
			// controller: 'EditorViewCtlr'
		});

		$locationProvider.html5Mode(true);
	});

	app.controller('AppCtlr', function($rootScope){
		var self = this;

		$rootScope.pageTitle = 'Presentation Builder';
	});
})(angular.module('app', [
	'ngResource',
	'ngSanitize',
	'ngRoute',

	//EDITOR
	'templatesModule',
	'stylingModule',
	'elementsModule',
	'editorView',
	'sidebarModule',

	//VIEWER
	'presentationRender',
	'viewerView',

	//BOTH
	'dataShare',
]));
