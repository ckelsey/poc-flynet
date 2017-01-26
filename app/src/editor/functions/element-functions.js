(function(app){
	'use strict';

	app.directive('elementFunctions', function(ElementModel, ElementActions, debouncer, dataShareService, EditorVars, functionsService){

		return {
			restrict: 'E',
			templateUrl: 'element-functions.html',
			link: function(scope, element, attributes){
				scope.ElementActions = ElementActions;
				scope.ElementModel = ElementModel;

				if(!ElementActions.selectedElement.data.hasOwnProperty('events') || !ElementActions.selectedElement.data.events){
					ElementActions.selectedElement.data.events = angular.copy(ElementModel.events);
				}

				scope.openAddFunctionDialogue = function(evt) {
					functionsService.addFunctionDialogueOpen = evt;
				};

				scope.removeFunction = function(evt, fn){
					console.log(evt, fn);
					for(var i=0; i<ElementActions.selectedElement.data.events[evt].functions.length; i=i+1){
						if(ElementActions.selectedElement.data.events[evt].functions[i].name === fn.name){
							ElementActions.selectedElement.data.events[evt].functions.splice(i, 1);
							break;
						}
					}

					ElementModel.updateWithoutPostBack();
				};
			}
		};
	});

})(angular.module('functionsModule'));
