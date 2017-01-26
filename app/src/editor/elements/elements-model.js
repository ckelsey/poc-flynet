(function(app){
	'use strict';

	app.service('ElementModel', function(dataShareService, $timeout, EditorVars, Utility, $rootScope, debouncer, $q){

		var self = {

			currentElement: null,
			elementStructure: null,
			previousStructure: null,
			templateTitleString: null,
			lastPage: 0,
			lastId: null,
			templateName: null,
			pageLength: null,
			allData: null,

			elements: {

				image: {
					name: 'image',
					title: 'image',
					tag: 'img',
					content: [],
					attributes: {
						width: null,
						height: null,
						src: null,
						style: {
							position: 'relative'
						}
					}
				},

				text: {
					name: 'text',
					title: 'text',
					tag: 'p',
					content: [],
					attributes: {
						style: {
							position: 'relative'
						}
					}
				},

				button: {
					name: 'button',
					title: 'button',
					tag: 'button',
					content: [],
					attributes: {
						style: {
							position: 'relative'
						}
					}
				},

				textField: {
					name: 'text field',
					title: 'text field',
					tag: 'input',
					content: [],
					attributes: {
						type: 'text',
						style: {
							position: 'relative'
						}
					}
				},

				textArea: {
					name: 'text area',
					title: 'text area',
					tag: 'textarea',
					content: [],
					attributes: {
						style: {
							position: 'relative'
						}
					}
				},

				row: {
					name: 'row',
					title: 'row',
					tag: 'div',
					content: [],
					attributes: {
						class: 'element-flex-wrapper',
						style: {
							position: 'relative'
						}
					}
				},

				column: {
					name: 'column',
					title: 'column',
					tag: 'div',
					content: [],
					attributes: {
						class: 'element-flex-column',
						style: {
							position: 'relative'
						}
					}
				}
			},

			classes: {
				btn:{
					name: 'btn',
					id: 'buttonClass',
					rules: {
						'background-color': '#06a7f9',
						'border': 'none',
						'appearance': 'none',
						'border-radius': '1px',
						'outline-color': 'transparent',
						'outline-width': '0px',
						'box-shadow': 'rgba(0, 0, 0, 0.5) 0px 1px 0px',
						'padding': '5px 15px',
						'color': '#FFFFFF',
						'transition': 'transform .2s',
						'-webkit-filter': 'blur(none)',
						'backface-visibility': 'hidden',
						'transform': 'scale(1) translateZ(0)'
					},
					pseudo: {
						hover: {
							'transform': 'scale(1.1) translateZ(0)',
							'zoom': '101%'
						}
					}
				}
			},

			functions:{
				timer: {
					name: 'timer',
					id: 'timer',
					fn: "var defer = arguments[0].defer(); setTimeout(function(){defer.resolve('Time out complete');}, 5000);return defer.promise;"
				}
			},

			events: {
				click: {
					functions: [],
					args: []
				}
			},

			makeId: function(prefix, len){
				prefix = prefix === undefined ? 'element_' : prefix;
				len = len || 28;
				var text = "";
				var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

				for( var i=0; i < len; i++ )
				text += possible.charAt(Math.floor(Math.random() * possible.length));

				return prefix + text;
			},

			findElement: function(pathString){
				var obj;

				if(pathString){
					var path = pathString.split('.');
					obj = self.elementStructure.pages[self.lastPage];

					for(var i=0; i<path.length; i=i+1){
						if(path[i] !== ''){
							obj = obj[path[i]];
						}
					}
				}

				return obj;
			},

			deleteElement: function(pathString, id){
				var obj;

				if(pathString){
					var path = pathString.split('.');
					obj = self.elementStructure.pages[self.lastPage];

					for(var i=0; i<path.length; i=i+1){
						if(path[i] !== ''){
							if(obj[path[i]] && obj[path[i]].hasOwnProperty('id') && obj[path[i]].id === id){
								obj.splice(path[i], 1);
								break;
							}else{
								obj = obj[path[i]];
							}
						}
					}
				}

				self.postUpdate();
			},

			postUpdate: function() {
				dataShareService.post({
					obj: 'currentView',
					data: self.elementStructure
				}, EditorVars.iframeSelector);
			},

			update: function(data, selectedElement){

				$timeout(function(){
					if(data.templates && Object.keys(data.templates).length){
						self.previousStructure = angular.copy(self.elementStructure);
						self.lastPage = data.lastPage;
						self.lastId = data.lastTemplate;
						self.templateName = data.templates[data.lastTemplate].name;
						self.elementStructure = data.templates[data.lastTemplate];
						self.pageLength = data.templates[data.lastTemplate].pages.length;
						self.allData = data;

						if(data.lastTemplate){
							self.templateTitleString = Utility.trust_html(self.elementStructure.name + '<span>&nbsp;&nbsp;Page ' + (self.lastPage + 1) + ' of ' + self.pageLength + '</span>');

							var needsUpdate = false;

							if(!self.elementStructure.hasOwnProperty('classes')){
								self.elementStructure.classes = angular.copy(self.classes);
								needsUpdate = true;
							}

							if(!self.elementStructure.hasOwnProperty('functions')){
								self.elementStructure.functions = angular.copy(self.functions);
								needsUpdate = true;
							}

							if(needsUpdate){
								self.postUpdate();
							}
						}

						$rootScope.$emit('updateElementListeners', {
							currentView: self.elementStructure.pages[self.lastPage],
							selectedElement: selectedElement
						});
					}else{
						self.reset();
					}
				});
			},

			updateWithoutPostBack: function(){
				debouncer({
					name: 'updateClasses',
					fn: function(){
						dataShareService.post({
							obj: 'updateWithoutPostBack',
							data: self.elementStructure
						}, EditorVars.iframeSelector);
					}
				});
			},

			reset: function(){
				self.lastPage = 0;
				self.lastId = null;
				self.templateName = null;
				self.pageLength = null;
				self.elementStructure = null;
				self.templateTitleString = null;
				self.allData = null;
			}
		};

		return self;
	});

})(angular.module('elementsModule'));
