(function(app){
	'use strict';

	app.directive('elementSettingInputs', function(ElementModel, ElementActions, dataShareService, EditorVars, $compile){
		return {
			restrict: 'E',
			link: function(scope, element, attributes){

				var html = '';

				function renderTextInput(){
					var temp = '';
					var attrs = '';

					for(var a in scope.$parent.data.attributes){
						attrs = attrs + ' ' + a + '="' + scope.$parent.data.attributes[a] + '"';
					}

					if(scope.$parent.data.label){
						temp = '<label for="'+ scope.$parent.data.attributes.id +'">'+ scope.$parent.data.label +'</label>';
					}

					temp = temp +
						'<input type="text" ng-model="'+
						scope.$parent.data.model +
						'"'+
						attrs +
						' />';

					return temp;
				}

				function renderButton(){
					var temp = '';
					var attrs = '';

					for(var a in scope.$parent.data.attributes){
						attrs = attrs + ' ' + a + '="' + scope.$parent.data.attributes[a] + '"';
					}

					temp = '<button '+ attrs +'>'+ scope.$parent.data.label +'</button>';

					return temp;
				}

				function renderTextAndButton(){
					var temp = '';
					var attrs = '';

					for(var a in scope.$parent.data.attributes){
						attrs = attrs + ' ' + a + '="' + scope.$parent.data.attributes[a] + '"';
					}

					temp = '<div class="flex-wrapper"><input style="width:auto;align-self: flex-end;" type="text" ng-model="'+
						scope.$parent.data.model +
						'" />';

					temp = temp + '<button '+ attrs +'>'+ scope.$parent.data.label +'</button></div>';

					return temp;
				}

				function renderSelect(){
					scope.options = scope.$parent.data.options;

					var temp = '';
					var attrs = '';

					for(var a in scope.$parent.data.attributes){
						attrs = attrs + ' ' + a + '="' + scope.$parent.data.attributes[a] + '"';
					}

					if(scope.$parent.data.label){
						temp = '<label for="'+ scope.$parent.data.attributes.id +'">'+ scope.$parent.data.label +'</label>';
					}

					temp = temp + '<select ng-model="selected" ng-options="item as item.value for item in options"'+ attrs +'></select>';

					return temp;
				}

				function renderColor(){
					var temp = '';
					var attrs = '';

					for(var a in scope.$parent.data.attributes){
						attrs = attrs + ' ' + a + '="' + scope.$parent.data.attributes[a] + '"';
					}

					if(scope.$parent.data.label){
						temp = '<label for="'+ scope.$parent.data.attributes.id +'">'+ scope.$parent.data.label +'</label>';
					}

					temp = temp + '<a-ckolor'+ attrs +' type="hidden" model="'+ scope.$parent.data.model +'"></a-ckolor>';

					return temp;
				}

				switch (scope.$parent.data.type) {
					case 'text':
					html = renderTextInput();
					break;

					case 'button':
					html = renderButton();
					break;

					case 'textAndButton':
					html = renderTextAndButton();
					break;

					case 'select':
					html = renderSelect();
					break;

					case 'color':
					html = renderColor();
					break;
				}

				var linkFn = $compile(html);
				var content = linkFn(scope);
				element.append(content);
			}
		};
	});

})(angular.module('stylingModule'));
