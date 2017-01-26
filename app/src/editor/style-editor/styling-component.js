(function(app){
	'use strict';

	app.directive('stylingComponent', function(ElementModel, ElementActions, dataShareService, EditorVars, $rootScope, debouncer){
		return {
			restrict: 'E',
			templateUrl: 'styling-component.html',
			link: function(scope, element, attributes){

				scope.ElementModel = ElementModel;
				scope.ElementActions = ElementActions;
				scope.settingsView = '';
				$rootScope.font_color = '#000';

				var range = "",
				savedSelection,
				iframeWindow,
				iframeDocument;

				function getIframeWindow(){
					var iframeElement = document.getElementById(EditorVars.iframeSelector.split('#')[1]);
					iframeWindow = iframeElement.contentWindow || iframeElement;

					return iframeWindow;
				}

				function getIframeDoc(){
					if(!iframeWindow){
						iframeWindow = getIframeWindow();
					}

					iframeDocument = iframeWindow.contentDocument || iframeWindow.document;

					return iframeDocument;
				}

				getIframeDoc();

				scope.switchViewToStyles = function(){
					scope.settingsView = '';
				};

				scope.updateStyle = function(selected){

					if(ElementActions.selectedElement.data.attributes.style){
						ElementActions.selectedElement.data.attributes.style[selected.model] = selected.value;
						scope.updateAttr();
					}
				};

				scope.callCommand = function(selected){
					scope.execCommand(selected.command, selected.value);
				};

				scope.execCommand = function(key, val){
					if(ElementActions.selectedElement){

						getIframeDoc();

						var targetEl = ElementActions.selectedElement.element;

						if(targetEl){

							iframeDocument.execCommand(key, false, val);

							dataShareService.post('saveTextEdit', EditorVars.iframeSelector);

							targetEl.querySelector('span').focus();
						}
					}
				};

				scope.deleteElement = function(){
					ElementModel.deleteElement(ElementActions.selectedElement.element.getAttribute('data-path'), ElementActions.selectedElement.element.id);
					ElementActions.selectedElement = null;
				};

				scope.updateAttr = function(){

					debouncer({
						name: 'updateAttr',
						fn: function() {
							dataShareService.post({
								obj: 'currentView',
								data: ElementModel.elementStructure
							}, EditorVars.iframeSelector);
						},
						arguments: [dataShareService, ElementModel, EditorVars],
						time: 250
					});
				};

				scope.$watch(function(){
					return $rootScope.font_color;
				}, function(n){
					scope.execCommand('foreColor', n);
				});

				scope.$watch(function(){
					return _.get(ElementActions, 'ElementActions.selectedElement.data.attributes.style.color');
				}, function(n, o){
					if(n !== o){
						scope.updateAttr();
					}
				});

				scope.$watch(function(){
					return _.get(ElementActions, 'ElementActions.selectedElement.data.attributes.style.backgroundColor');
				}, function(n, o){
					if(n !== o){
						scope.updateAttr();
					}
				});




				scope.inputs = {
					settings: {
						p: [{
							type: 'select',
							label: 'Font',
							model: 'selected',
							attributes: {
								"ng-change": "callCommand(selected)"
							},
							options: [
								{value: '\'Arial Black\', Gadget, sans-serif', command: 'fontName'},
								{value: 'Impact, Charcoal, sans-serif', command: 'fontName'},
								{value: '\'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif', command: 'fontName'},
								{value: 'Tahoma, Geneva, sans-serif', command: 'fontName'},
								{value: '\'Trebuchet MS\', Helvetica, sans-serif', command: 'fontName'},
								{value: 'Verdana, Geneva, sans-serif', command: 'fontName'},
								{value: '\'Comic Sans MS\', cursive, sans-serif', command: 'fontName'},
								{value: '\'Palatino Linotype\', \'Book Antiqua\', Palatino, serif', command: 'fontName'},
								{value: 'Georgia, serif', command: 'fontName'},
								{value: 'Papyrus, fantasy', command: 'fontName'},
								{value: 'cursive', command: 'fontName'},
								{value: 'monospace', command: 'fontName'}
							]
						},{
							type: 'select',
							label: 'Size',
							model: 'selected',
							attributes: {
								"ng-change": "callCommand(selected)"
							},
							options: [
								{value: 1, command: 'fontSize'},
								{value: 2, command: 'fontSize'},
								{value: 3, command: 'fontSize'},
								{value: 4, command: 'fontSize'},
								{value: 5, command: 'fontSize'},
								{value: 6, command: 'fontSize'},
								{value: 7, command: 'fontSize'},
							]
						},{
							type: 'button',
							label: '<span>Color</span><span style="opacity:0;position: absolute;width: 100%;height: 100%;left: 0px;top: 0px;"><a-ckolor class="fa fa-eyedropper" model="$root.font_color" type="\'hidden\'" blur="true" default-color="\'#000\'"></a-ckolor></span>',
							attributes: {}
						},{
							type: 'button',
							label: 'Bold',
							attributes: {
								"ng-click": "execCommand('bold')"
							}
						},{
							type: 'button',
							label: 'Italic',
							attributes: {
								"ng-click": "execCommand('italic')"
							}
						},{
							type: 'button',
							label: 'Underline',
							attributes: {
								"ng-click": "execCommand('underline')"
							}
						},{
							type: 'button',
							label: 'Align left',
							attributes: {
								"ng-click": "execCommand('justifyLeft')"
							}
						},{
							type: 'button',
							label: 'Align center',
							attributes: {
								"ng-click": "execCommand('justifyCenter')"
							}
						},{
							type: 'button',
							label: 'Align right',
							attributes: {
								"ng-click": "execCommand('justifyRight')"
							}
						},{
							type: 'textAndButton',
							label: 'Link',
							model: 'linkUrl',
							attributes: {
								"ng-click": "execCommand('createLink', linkUrl)"
							}
						},{
							type: 'button',
							label: 'Unlink',
							attributes: {
								"ng-click": "execCommand('unlink')"
							}
						}],





						img: [{
							type: 'text',
							label: 'Image',
							model: 'ElementActions.selectedElement.data.attributes.src',
							attributes: {
								id: 'img-src',
								"ng-blur": "updateAttr()",
								style: "width: 100%; max-width: 630px;"
							}
						}]
					},


					styles: {
						display: [{
							type: 'select',
							label: 'Display',
							model: 'selected',
							attributes: {
								"ng-change": "updateStyle(selected)"
							},
							options: [
								{value: 'block', model: 'display'},
								{value: 'inline', model: 'display'},
								{value: 'inline-block', model: 'display'},
								{value: 'flex', model: 'display'},
								{value: 'none', model: 'display'}
							]
						},{
							type: 'text',
							label: 'Opacity',
							model: 'ElementActions.selectedElement.data.attributes.style.opacity',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						},{
							type: 'select',
							label: 'Visibility',
							model: 'selected',
							attributes: {
								"ng-change": "updateStyle(selected)"
							},
							options: [
								{value: 'visible', model: 'visibility'},
								{value: 'hidden', model: 'visibility'}
							]
						},{
							type: 'select',
							label: 'Overflow',
							model: 'selected',
							attributes: {
								"ng-change": "updateStyle(selected)"
							},
							options: [
								{value: 'visible', model: 'overflow'},
								{value: 'hidden', model: 'overflow'},
								{value: 'scroll', model: 'overflow'},
								{value: 'auto', model: 'overflow'}
							]
						},{
							type: 'color',
							label: 'Background color',
							model: 'ElementActions.selectedElement.data.attributes.style.backgroundColor',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						},{
							type: 'text',
							label: 'Background image',
							model: 'ElementActions.selectedElement.data.attributes.style.backgroundImage',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						},{
							type: 'text',
							label: 'Background size',
							model: 'ElementActions.selectedElement.data.attributes.style.backgroundSize',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						},{
							type: 'text',
							label: 'Background position',
							model: 'ElementActions.selectedElement.data.attributes.style.backgroundPosition',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						}],


						positioning: [{
							type: 'select',
							label: 'Position',
							model: 'selected',
							attributes: {
								"ng-change": "updateStyle(selected)"
							},
							options: [
								{value: 'relative', model: 'position'},
								{value: 'absolute', model: 'position'},
								{value: 'fixed', model: 'position'}
							]
						},{
							type: 'text',
							label: 'Z-index',
							model: 'ElementActions.selectedElement.data.attributes.style.zIndex',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						},{
							type: 'text',
							label: 'Top',
							model: 'ElementActions.selectedElement.data.attributes.style.top',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						},{
							type: 'text',
							label: 'Bottom',
							model: 'ElementActions.selectedElement.data.attributes.style.bottom',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						},{
							type: 'text',
							label: 'Left',
							model: 'ElementActions.selectedElement.data.attributes.style.left',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						},{
							type: 'text',
							label: 'Right',
							model: 'ElementActions.selectedElement.data.attributes.style.right',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						}],



						dimensions: [{
							type: 'text',
							label: 'Width',
							model: 'ElementActions.selectedElement.data.attributes.style.width',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						},{
							type: 'text',
							label: 'Height',
							model: 'ElementActions.selectedElement.data.attributes.style.height',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						},{
							type: 'text',
							label: 'Margin',
							model: 'ElementActions.selectedElement.data.attributes.style.margin',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						},{
							type: 'text',
							label: 'Padding',
							model: 'ElementActions.selectedElement.data.attributes.style.padding',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						}],

						text: [{
							type: 'select',
							label: 'Font',
							model: 'selected',
							attributes: {
								"ng-change": "updateStyle(selected)"
							},
							options: [
								{value: '\'Arial Black\', Gadget, sans-serif', model: 'fontFamily'},
								{value: 'Impact, Charcoal, sans-serif', model: 'fontFamily'},
								{value: '\'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif', model: 'fontFamily'},
								{value: 'Tahoma, Geneva, sans-serif', model: 'fontFamily'},
								{value: '\'Trebuchet MS\', Helvetica, sans-serif', model: 'fontFamily'},
								{value: 'Verdana, Geneva, sans-serif', model: 'fontFamily'},
								{value: '\'Comic Sans MS\', cursive, sans-serif', model: 'fontFamily'},
								{value: '\'Palatino Linotype\', \'Book Antiqua\', Palatino, serif', model: 'fontFamily'},
								{value: 'Georgia, serif', model: 'fontFamily'},
								{value: 'Papyrus, fantasy', model: 'fontFamily'},
								{value: 'cursive', model: 'fontFamily'},
								{value: 'monospace', model: 'fontFamily'}
							]
						},{
							type: 'text',
							label: 'Size',
							model: 'ElementActions.selectedElement.data.attributes.style.fontSize',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						},{
							type: 'select',
							label: 'Weight',
							model: 'selected',
							attributes: {
								"ng-change": "updateStyle(selected)"
							},
							options: [
								{value: 'bold', model: 'fontWeight'},
								{value: 'normal', model: 'fontWeight'},
								{value: 'light', model: 'fontWeight'},
							]
						},{
							type: 'select',
							label: 'Style',
							model: 'selected',
							attributes: {
								"ng-change": "updateStyle(selected)"
							},
							options: [
								{value: 'italic', model: 'fontStyle'},
								{value: 'normal', model: 'fontStyle'},
								{value: 'oblique', model: 'fontStyle'},
							]
						},{
							type: 'select',
							label: 'Align',
							model: 'selected',
							attributes: {
								"ng-change": "updateStyle(selected)"
							},
							options: [
								{value: 'left', model: 'textAlign'},
								{value: 'center', model: 'textAlign'},
								{value: 'right', model: 'textAlign'},
							]
						},{
							type: 'select',
							label: 'Decoration',
							model: 'selected',
							attributes: {
								"ng-change": "updateStyle(selected)"
							},
							options: [
								{value: 'none', model: 'textDecoration'},
								{value: 'underline', model: 'textDecoration'},
								{value: 'overline', model: 'textDecoration'},
								{value: 'line-through', model: 'textDecoration'},
							]
						},{
							type: 'color',
							label: 'Color',
							model: 'ElementActions.selectedElement.data.attributes.style.color',
							attributes: {
								//"ng-change": "updateAttr()"
							},
						},{
							type: 'text',
							label: 'Shadow',
							model: 'ElementActions.selectedElement.data.attributes.style.textShadow',
							attributes: {
								"ng-blur": "updateAttr()"
							},
						}]
					}
				};
			}
		};
	});

})(angular.module('stylingModule'));
