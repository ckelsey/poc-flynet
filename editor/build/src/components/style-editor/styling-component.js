(function(app){
	'use strict';

	app.directive('stylingComponent', function(ElementService, dataShareService, EditorVars){
		return {
			restrict: 'E',
			templateUrl: 'styling-component.html',
			link: function(scope, element, attributes){
				scope.ElementService = ElementService;

				scope.updateAttr = function(attr){
					if(attr){
						dataShareService.post({
							obj: 'currentView',
							data: ElementService.elementStructure
						}, EditorVars.iframeSelector);
					}
				};

				scope.newPage = function(){
					dataShareService.post('newPage', EditorVars.iframeSelector);
				};

				scope.nextPage = function(){
					dataShareService.post('nextPage', EditorVars.iframeSelector);
				};

				scope.previousPage = function(){
					dataShareService.post('previousPage', EditorVars.iframeSelector);
				};
			}
		};
	});

})(angular.module('stylingModule', ['dataShare']));
