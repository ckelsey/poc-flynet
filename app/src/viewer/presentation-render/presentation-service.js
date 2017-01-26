(function(app){
	'use strict';

	app.service('presentationService', function(dataShareService, $localStorage, $timeout, Utility, $rootScope, debouncer, $q){

		var self = {};

		if(!$rootScope.editor){
			if(!$localStorage.hasOwnProperty('flynet')){
				$localStorage.flynet = {
					templates: {},
					lastTemplate: null,
					lastPage: null,
				};
			}

			self = {
				events: dataShareService,

				historyIndex: null,

				defaultView: {
					name: 'Blank',
					id: 'blank',
					pages: [{
						name: 'Blank',
						id: 'blank',
						content: []
					}],
					history: []
				},

				currentView: null,
				currentViewId: null,
				currentPage: 0,

				reset: function() {
					delete $localStorage.flynet.templates[self.currentViewId];
					self.currentViewId = null;
					self.currentPage = null;
					self.updateTemplate(true);
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

				historyLocalStorageSize: function(history){
					try{
						history = history ? angular.toJson(history) : angular.toJson($localStorage.flynet.templates[self.currentViewId].history);
						var t = 0;
						for(var x in history){
							t += (((history[x].length * 2)));
						}
						var result = t/1024;
						return result;
					}catch(e){
						return 0;
					}
				},

				callFunction: function(str){
					return new Function(str).apply(this, [$q]);
				},

				callClick: function(el){
					if(el.events){
						var evt = el.events.click;

						var fn = self.callFunction(evt.functions[0].fn);
						if(fn && fn.hasOwnProperty('$$state')){
							fn.then(function(res){
								console.log(res);
							});
						}
					}
				},

				saveHistory: function(){
					var defer = $q.defer();

					debouncer({
						name: 'saveHistory',
						fn: function(){

							var current, prev, historyToCut;

							if(!self.currentView.historyIndex && self.currentView.historyIndex !== 0){
								self.currentView.historyIndex = self.currentView.history.length ? self.currentView.history.length - 1 : 0;
							}else if(self.currentView.historyIndex !== self.currentView.history.length - 1){
								current = angular.copy(self.currentView);
								prev = angular.copy(self.currentView.history[self.currentView.historyIndex]);

								if(current){
									delete current.history;
									delete current.historyIndex;
									delete current.timeId;
								}

								if(prev){
									delete prev.history;
									delete prev.historyIndex;
									delete prev.timeId;
								}

								if(angular.toJson(current) !== angular.toJson(prev)){
									historyToCut = self.currentView.history.length - self.currentView.historyIndex - 1;

									if(historyToCut && historyToCut > 0){
										self.currentView.history.splice(self.currentView.historyIndex, (historyToCut + 1));
									}

									current.timeId = new Date().getTime();

									self.currentView.history.push(current);

									while(self.historyLocalStorageSize(self.currentView.history) > 1024){
										self.currentView.history.shift();
									}

									self.currentView.historyIndex = self.currentView.history.length - 1;

									self.updateTemplate(true);
								}

								return defer.resolve();
							}

							current = angular.copy(self.currentView);
							prev = angular.copy($localStorage.flynet.templates[self.currentViewId]);
							var lastModification = {};

							if($localStorage.flynet.templates[self.currentViewId]){
								lastModification = angular.copy($localStorage.flynet.templates[self.currentViewId].history[$localStorage.flynet.templates[self.currentViewId].history.length - 1]);
							}

							if(current){
								delete current.history;
								delete current.historyIndex;
								delete current.timeId;
							}

							if(prev){
								delete prev.history;
								delete prev.historyIndex;
							}

							if(lastModification){
								delete lastModification.history;
								delete lastModification.historyIndex;
								delete lastModification.timeId;
							}

							if(angular.toJson(current) !== angular.toJson(lastModification)){
								if(!prev){
									prev = current;
								}

								historyToCut = self.currentView.history.length - self.currentView.historyIndex - 1;

								if(historyToCut && historyToCut > 0){
									self.currentView.history.splice(self.currentView.historyIndex, historyToCut);
								}

								prev.timeId = new Date().getTime();

								self.currentView.history.push(prev);

								while(self.historyLocalStorageSize(self.currentView.history) > 1024){
									self.currentView.history.shift();
								}

								self.currentView.historyIndex = self.currentView.history.length - 1;

								self.updateTemplate(true);
							}

							defer.resolve();
						},
						time: 500
					});

					return defer.promise;
				},

				goToHistory: function(index) {
					self.currentView.historyIndex = index;

					var temp = _.get(self, 'currentView');

					if(temp){

						temp = angular.copy(temp.history[self.currentView.historyIndex]);

						if(temp){
							temp.historyIndex = self.currentView.historyIndex;
							temp.history = angular.copy(self.currentView.history);
							self.currentView = temp;
							self.updateTemplate(true);
						}
					}
				},

				undo: function(){
					if(self.currentView.historyIndex > -1){
						self.updateTemplate();

						var temp = _.get(self, 'currentView');

						if(temp){

							temp = angular.copy(temp.history[self.currentView.historyIndex - 1]);

							if(temp){
								temp.historyIndex = self.currentView.historyIndex - 1;
								temp.history = angular.copy(self.currentView.history);
								self.currentView = temp;
								self.updateTemplate(true);
							}
						}
					}
				},

				redo: function(){
					if(self.currentView.historyIndex !== null){
						var temp = _.get(self, 'currentView');

						if(temp){
							temp = angular.copy(temp.history[self.currentView.historyIndex + 1]);

							if(temp){

								temp.historyIndex = self.currentView.historyIndex + 1;
								temp.history = angular.copy(self.currentView.history);
								self.currentView = temp;
								self.updateTemplate(true);
							}
						}
					}
				},

				updateTemplate: function(dontSave, dontPostUpdate) {
					function update(){
						if(!self.currentView.timeId){
							self.currentView.timeId = new Date().getTime();
						}

						$localStorage.flynet.templates[self.currentViewId] = angular.copy(self.currentView);
						$localStorage.flynet.lastPage = angular.copy(self.currentPage);
						$localStorage.flynet.lastTemplate = angular.copy(self.currentViewId);

						if(!dontPostUpdate){
							self.postUpdate();
						}
					}

					if(self.currentViewId){

						if(!dontSave){
							self.saveHistory();
							update();
						}else{
							update();
						}
					}
				},

				findElement: function(pathString){
					var obj;

					if(pathString){
						var path = pathString.split('.');
						obj = self.currentView.pages[self.currentPage];

						for(var i=0; i<path.length; i=i+1){
							if(path[i] !== ''){
								obj = obj[path[i]];
							}
						}
					}

					return obj;
				},

				addElement: function(data) {

					if(data && data.hasOwnProperty('element') && data.element && data.element.hasOwnProperty('tag') && data.element.tag){

						var target = document.querySelector(data.evt.target);

						if(target){

							if(!target.getAttribute('view-element')){
								target = target.querySelector('[view-element]');
							}

							var targetScope = angular.element(target).scope();
							if(!targetScope.hasOwnProperty('elementPath')){
								targetScope = targetScope.$$childHead;
							}

							var path = targetScope.elementPath;
							var obj = self.currentView.pages[self.currentPage];
							data.element.id = self.makeId();

							if(path !== ''){
								path = path.split('.');
								obj = self.currentView.pages[self.currentPage];

								for(var i=0; i<path.length; i=i+1){
									if(path[i] !== ''){
										obj = obj[path[i]];
									}
								}
							}

							obj.content.push(data.element);

							self.updateTemplate();
						}
					}
				},

				resizeElement: function(data){
					var element = document.getElementById(data.selector);

					if(element){
						var elementObject = self.findElement(element.getAttribute('data-path'));
						elementObject.attributes.style.width = data.dimensions.width;
						elementObject.attributes.style.height = data.dimensions.height;

						element.style.width = data.dimensions.width;
						element.style.height = data.dimensions.height;

						self.updateTemplate();
					}
				},

				moveElement: function(data){
					var element = document.getElementById(data.selector);

					if(element){
						var elementObject = self.findElement(element.getAttribute('data-path'));
						elementObject.attributes.style.left = data.dimensions.x;
						elementObject.attributes.style.top = data.dimensions.y;

						element.style.left = data.dimensions.x;
						element.style.top = data.dimensions.y;

						self.updateTemplate();
					}
				},


				postUpdate: function(){
					debouncer({
						name: 'postUpdate',
						fn: function() {
							var data = angular.copy($localStorage.flynet);
							dataShareService.post({
								obj: 'htmlUpdate',
								data: data
							}, 'parent');
						}
					});
				},

				newTemplate: function(data){
					$timeout(function(){
						var temp = angular.copy(self.defaultView);

						temp.name = data.name;
						temp.id = self.makeId();
						temp.pages[0].id = self.makeId();
						self.currentViewId = temp.id;
						self.currentView = temp;
						self.currentPage = 0;

						self.updateTemplate();
					});
				},

				newPage: function(){
					self.currentPage = self.currentView.pages.length;

					self.currentView.pages.push({
						name: 'Page '+self.currentView.pages.length,
						id: self.makeId(),
						content: []
					});

					self.updateTemplate();
				},

				nextPage: function() {
					if(self.currentView.pages.length >= self.currentPage + 1){
						self.currentPage = self.currentPage + 1;
						self.updateTemplate(true);
					}
				},

				previousPage: function(){
					if(self.currentPage > -1){
						self.currentPage = self.currentPage - 1;
						self.updateTemplate(true);
					}
				},

				importTemplate: function(data){

					data = JSON.parse(data);

					$localStorage.flynet = data;

					self.init();
				},

				openTemplate: function(data){
					self.currentView = angular.copy($localStorage.flynet.templates[data.id]);
					self.currentViewId = data.id;
					self.currentPage = 0;

					self.updateTemplate(true);
				},

				updateClasses: function(data){
					self.currentView.classes = data;
					self.updateTemplate(null, true);
				},

				init: function(){
					if($localStorage.flynet.lastTemplate){

						var page = $localStorage.flynet.lastPage || 0;

						if($localStorage.flynet.templates[$localStorage.flynet.lastTemplate]){
							self.currentView = angular.copy($localStorage.flynet.templates[$localStorage.flynet.lastTemplate]);
							self.currentViewId = angular.copy($localStorage.flynet.lastTemplate);
							self.currentPage = page;

							if(!self.currentView.historyIndex){
								self.currentView.historyIndex = self.currentView.history.length - 1;
							}

							self.updateTemplate(true);
						}else{
							self.postUpdate();
						}
					}
				}
			};

			self.init();
		}

		return self;
	});
})(angular.module('presentationRender'));
