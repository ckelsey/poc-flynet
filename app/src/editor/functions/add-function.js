(function(app){
	'use strict';

	app.directive('addFunction', function(ElementModel, ElementActions, debouncer, dataShareService, EditorVars, functionsService){

		return {
			restrict: 'E',
			templateUrl: 'add-function.html',
			link: function(scope, element, attributes){
				scope.addFunction = function(fn){

					if(!ElementActions.selectedElement.data.hasOwnProperty('events') || !ElementActions.selectedElement.data.events){
						ElementActions.selectedElement.data.events = angular.copy(ElementModel.events);
					}



					for(var i=0; i<ElementActions.selectedElement.data.events[functionsService.addFunctionDialogueOpen].functions.length; i=i+1){
						if(ElementActions.selectedElement.data.events[functionsService.addFunctionDialogueOpen].functions[i].name === fn.name){
							functionsService.addFunctionDialogueOpen = false;
							return false;
						}
					}

					ElementActions.selectedElement.data.events[functionsService.addFunctionDialogueOpen].functions.push(fn);

					ElementModel.updateWithoutPostBack();

					functionsService.addFunctionDialogueOpen = false;
				};
			}
		};
	});

})(angular.module('functionsModule'));
