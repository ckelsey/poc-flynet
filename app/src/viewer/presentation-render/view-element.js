(function(app){
	'use strict';

	app.directive('viewElement', function(presentationService, Utility, $compile, debouncer){
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

				if(!scope.elementPath){
					scope.elementPath = '';
				}

				scope.presentationService = presentationService;
				scope.Utility = Utility;
				scope.calls = function(){
					console.log('h');
				};


				function applyStyles() {
					if(scope.viewElement.hasOwnProperty('attributes') && scope.viewElement.attributes && scope.viewElement.attributes.hasOwnProperty('style') && scope.viewElement.attributes.style){
						element.css(scope.viewElement.attributes.style);
					}
				}

				function applyClasses() {
					if(scope.viewElement.hasOwnProperty('classes') && scope.viewElement.classes){
						for(var i=0; i<scope.viewElement.classes.length; i=i+1){
							element.css(scope.viewElement.classes[i].rules);

							if(scope.viewElement.classes[i].pseudo.hover){
								var hover = scope.viewElement.classes[i].pseudo.hover;
								var styles = element[0].getAttribute('style');

								function mouseEnter() {
									debouncer({
										name: 'event_mouseenter_' + scope.viewElement.classes[i],
										fn: function(){
											styles = element[0].getAttribute('style');
											element.css(hover);
										},
										time: 10
									});
								}

								function mouseLeave() {
									debouncer({
										name: 'event_mouseleave_' + scope.viewElement.classes[i],
										fn: function(){
											element[0].setAttribute('style', styles);
										},
										time: 10
									});
								}

								element.off('mouseenter', mouseEnter);
								element.on('mouseenter', mouseEnter);

								element.off('mouseleave', mouseLeave);
								element.on('mouseleave', mouseLeave);
							}
						}
					}
				}

				function eventHtml(){
					var html = '';

					if(scope.viewElement.events){
						for(var e in scope.viewElement.events){
							// scope['element_event_'+ e] = function(evt){
							// 	function callNext(index){
							// 		if(scope.viewElement.events[evt].functions && scope.viewElement.events[evt].functions.length && scope.viewElement.events[evt].functions[index]){
							// 			scope.viewElement.events[evt].functions[index];
							// 		}
							// 	};
							//
							// 	callNext(0);
							// };

							// html = 'ng-'+ e +'="presentationService.callEvent(viewElement.events[\''+ e +'\'])"';
							html = 'ng-'+ e +'="presentationService.callEvent()"';
						}
					}

					return html;
				}

				function generateHTML(){

					var textEditorHtml = '';

					if(scope.viewElement.hasOwnProperty('tag') && (scope.viewElement.tag === 'p' || scope.viewElement.tag === 'button')){

						if(inIframe()){
							textEditorHtml = '<span contentEditable text-edit '+
							// 'trumbowyg-ng editor-config="{btns: [' +
							// '\'formatting\','+
							// '\'bold\','+
							// '\'italic\','+
							// '\'|\','+
							// '\'link\','+
							// '\'btnGrp-justify\''+
							// ']}" ' +
							'ng-model="viewElement.text"></span>';
						}else{
							textEditorHtml = '<span ng-bind-html="Utility.trust_html(viewElement.text)"></span>';
						}

						if(!scope.viewElement.text || scope.viewElement.text === ''){
							scope.viewElement.text = ' ...Placeholder text... ';
						}
					}

					var attributesHtml = 'view-element="el" id="{{el.id}}" data-path="{{elementPath + \'.content.\' + $index}}" element-path="elementPath + \'.content.\' + $index" class="{{el.attributes.class}}"';
					var ngClassHtml = 'ng-class="el.content.length === 0 && (el.text === \'\' || !el.text) ? \'default-element\' : \'\'"';
					var textHtml = '<span ng-if="el.text" ng-bind-html="Utility.trust_html(el.text)"></span>';
					var events = eventHtml();

					var imgHtml = '<img ng-src="{{el.attributes && el.attributes.src ? el.attributes.src : \'/assets/placeholder_600x400.svg\'}}" ng-repeat-start="el in viewElement.content track by el.id" '+ attributesHtml +' '+ events +' ng-if="el.tag === \'img\'" />';
					var pHtml = '<p ' + attributesHtml +' '+ events +' ng-if="el.tag === \'p\'">'+ textHtml +'</p>';
					var divHtml = '<div '+ attributesHtml +' '+ events +' '+ ngClassHtml +' ng-if="el.tag === \'div\'"></div>';
					var buttonHtml = '<button ng-click="presentationService.callClick(el)" '+ attributesHtml +' '+ events + ' '+ ngClassHtml +' ng-if="el.tag === \'button\'">'+ textHtml +'</button>';
					var textareaHtml = '<textarea '+ attributesHtml +' '+ events +' '+ ngClassHtml +' ng-if="el.tag === \'textarea\'"></textarea>';
					var inputHtml = '<input '+ attributesHtml +' '+ events +' '+ ngClassHtml +' ng-if="el.tag === \'input\'" ng-repeat-end />';

					var fullHtml = textEditorHtml + imgHtml + pHtml + divHtml + buttonHtml + textareaHtml + inputHtml;
					element.html(fullHtml);
					$compile(element.contents())(scope);
					applyClasses();
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
