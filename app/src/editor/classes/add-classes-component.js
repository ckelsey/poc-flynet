(function(app){
	'use strict';

	app.directive('addClassesComponent', function(ElementModel, ElementActions, debouncer, dataShareService, EditorVars, classesService){

		return {
			restrict: 'E',
			templateUrl: 'add-classes-component.html',
			link: function(scope, element, attributes){
				scope.ElementModel = ElementModel;

				scope.addClass = function(_class){

					if(!ElementActions.selectedElement.data.hasOwnProperty('classes') || !ElementActions.selectedElement.data.classes){
						ElementActions.selectedElement.data.classes = [];
					}

					for(var i=0; i<ElementActions.selectedElement.data.classes.length; i=i+1){
						if(ElementActions.selectedElement.data.classes[i].name === _class.name){
							classesService.addClassDialogueOpen = false;
							return false;
						}
					}

					ElementActions.selectedElement.data.classes.push(_class);

					ElementModel.updateWithoutPostBack();

					classesService.addClassDialogueOpen = false;
				};
			}
		};
	});

})(angular.module('classesModule'));
