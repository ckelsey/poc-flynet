(function(app){
	'use strict';

	app.directive('classesComponent', function(ElementModel, debouncer, dataShareService, EditorVars){

		return {
			restrict: 'E',
			templateUrl: 'classes-component.html',
			link: function(scope, element, attributes){
				scope.ElementModel = ElementModel;
			}
		};
	});

})(angular.module('classesModule'));
