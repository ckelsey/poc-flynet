(function(app){
	'use strict';

	app.directive('htmlTree', function(ElementModel, ElementActions, EditorVars){
		return {
			restrict: 'E',
			scope: {data: '='},
			templateUrl: 'html-tree.html',
			link: function(scope, element, attributes){
				scope.ElementModel = ElementModel;
				scope.ElementActions = ElementActions;

				scope.showOverlay = function(){
					var iframe = document.getElementById(EditorVars.iframeSelector.split('#')[1]);
					iframe = iframe.contentWindow || iframe;
					var doc = iframe.contentDocument || iframe.document;

					ElementActions.showOverlay(doc.getElementById(scope.data.id));
				};
			}
		};
	});

})(angular.module('htmlTreeModule', [
	'elementsModule'
]));
