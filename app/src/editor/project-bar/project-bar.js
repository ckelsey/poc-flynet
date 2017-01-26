(function(app){
	'use strict';

	app.directive('projectBar', function(dataShareService, EditorVars, ElementModel) {
		return {
			restrict: 'E',
			templateUrl: 'project-bar.html',
			link: function(scope, element, attributes) {

				scope.ElementModel = ElementModel;

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


})(angular.module('projectBarModule', [
	'dataShare',
	'elementsModule',
]));
