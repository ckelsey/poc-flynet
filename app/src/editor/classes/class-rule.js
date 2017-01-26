(function(app){
	'use strict';

	app.directive('classRule', function(ElementModel, debouncer, dataShareService, EditorVars){

		return {
			restrict: 'A',
			link: function(scope, element, attributes){

				element.bind('blur', function(){

					ElementModel.elementStructure.classes[attributes.className].rules[attributes.ruleName] = this.textContent;

					ElementModel.updateWithoutPostBack();
				});
			}
		};
	});

})(angular.module('classesModule'));
