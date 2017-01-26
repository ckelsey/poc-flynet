(function(app){
	'use strict';

	app.directive('viewElement', function(presentationService, Utility, $compile, $state){
		return {
			restrict: 'A',
			scope: {
				elementPath:'=?',
				viewElement: '='
			},
			link: function(scope, element, attributes){
				function inIframe () {
					try {
						return window.self !== window.top;
					} catch (e) {
						return true;
					}
				}

				scope.mode = $state.params.mode;

				if(!scope.elementPath){
					scope.elementPath = '';
				}

				scope.presentationService = presentationService;
				scope.Utility = Utility;


				function applyStyles() {
					if(scope.viewElement.hasOwnProperty('attributes') && scope.viewElement.attributes && scope.viewElement.attributes.hasOwnProperty('style') && scope.viewElement.attributes.style){
						element.css(scope.viewElement.attributes.style);
					}
				}

				function generateHTML(){

					var textEditorHtml = '';

					if(scope.viewElement.hasOwnProperty('tag') && scope.viewElement.tag === 'p'){

						if(inIframe()){
							textEditorHtml = '<span ng-bind-html="Utility.trust_html(viewElement.text)" contentEditable text-edit trumbowyg-ng '+
							'editor-config="{btns: [' +
							'\'formatting\','+
							'\'bold\','+
							'\'italic\','+
							'\'|\','+
							'\'link\','+
							'\'btnGrp-justify\''+
							']}" ng-model="viewElement.text"></span>';
						}else{
							textEditorHtml = '<span ng-bind-html="Utility.trust_html(viewElement.text)"></span>';
						}

						if(!scope.viewElement.text || scope.viewElement.text === ''){
							scope.viewElement.text = ' ...Placeholder text... ';
						}
					}

					var attributesHtml = 'view-element="el" id="{{el.id}}" data-path="{{elementPath + \'.content.\' + $index}}" element-path="elementPath + \'.content.\' + $index"';
					var ngClassHtml = 'ng-class="el.content.length === 0 && (el.text === \'\' || !el.text) ? \'default-element\' : \'\'"';
					var textHtml = '<span ng-if="el.text" ng-bind-html="Utility.trust_html(el.text)"></span>';

					var imgHtml = '<img ng-src="{{el.attributes && el.attributes.src ? el.attributes.src : \'/assets/placeholder_600x400.svg\'}}" ng-repeat-start="el in viewElement.content track by el.id" '+ attributesHtml +' ng-if="el.tag === \'img\'" />';
					var pHtml = '<p ' + attributesHtml +' ng-if="el.tag === \'p\'">'+ textHtml +'</p>';
					var divHtml = '<div '+ attributesHtml +' '+ ngClassHtml +' ng-if="el.tag === \'div\'" ng-repeat-end></div>';

					element.html(textEditorHtml + imgHtml + pHtml + divHtml);
					$compile(element.contents())(scope);
					applyStyles();
					presentationService.postUpdate();
				}

				scope.$watch(function(){ return scope.viewElement;}, function(n,o){
					if(n){
						generateHTML();
					}
				});

				if(scope.viewElement){
					generateHTML();
				}
			}
		};
	});
})(angular.module('presentationRender'));
