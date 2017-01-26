(function(app){
	'use strict';

	app.directive('elementClasses', function(ElementModel, ElementActions, debouncer, dataShareService, EditorVars, classesService){

		return {
			restrict: 'E',
			templateUrl: 'element-classes.html',
			link: function(scope, element, attributes){
				scope.ElementActions = ElementActions;
				scope.ElementModel = ElementModel;

				scope.openAddClassDialogue = function() {
					classesService.addClassDialogueOpen = true;
				};

				scope.removeClass = function(_class){
					for(var i=0; i<ElementActions.selectedElement.data.classes.length; i=i+1){
						if(ElementActions.selectedElement.data.classes[i].name === _class.name){
							ElementActions.selectedElement.data.classes.splice(i, 1);
							break;
						}
					}

					ElementModel.updateWithoutPostBack();
				};
			}
		};
	});

})(angular.module('classesModule'));
