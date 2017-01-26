(function(app){
	'use strict';

	app.service('presentationService', function(dataShareService, $localStorage, $timeout, Utility){
console.log('asd')
		if(!$localStorage.hasOwnProperty('flynet')){
			$localStorage.flynet = {
				templates: {},
				lastTemplate: null,
				lastPage: null,
			};
		}

		var self = {
			events: dataShareService,

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
				//self.currentView = angular.copy(self.defaultView);
				delete $localStorage.flynet.templates[self.currentViewId];
				self.currentViewId = null;
				self.currentPage = null;
				self.updateTemplate();
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

			updateTemplate: function() {
				if(self.currentViewId){

					var prev = false;

					if($localStorage.flynet.templates.hasOwnProperty(self.currentViewId)){
						prev = angular.copy($localStorage.flynet.templates[self.currentViewId]);
					}


					$localStorage.flynet.templates[self.currentViewId] = self.currentView;

					if(prev){
						/* TODO: save history, but it's too big */
						// console.log(Utility.localStorageSize());
						// //$localStorage.flynet.templates[self.currentViewId].history.push(prev);
						// console.log(Utility.localStorageSize());
					}

					$localStorage.flynet.lastPage = self.currentPage;
					$localStorage.flynet.lastTemplate = self.currentViewId;

					self.postUpdate();
				}
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
					element.style.width = data.dimensions.width;
					element.style.height = data.dimensions.height;

					self.updateTemplate();
				}
			},

			postDebouncer: null,

			postUpdate: function(){
				clearTimeout(self.postDebouncer);

				self.postDebouncer = setTimeout(function() {
					var data = angular.copy($localStorage.flynet);
					dataShareService.post({
						obj: 'htmlUpdate',
						data: data
					}, 'parent');
				}, 250);
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
					self.updateTemplate();
				}
			},

			previousPage: function(){
				if(self.currentPage > -1){
					self.currentPage = self.currentPage - 1;
					self.updateTemplate();
				}
			},

			importTemplate: function(data){
				try{
					data = angular.toJson(data);
					data = angular.fromJson(data);
				}catch(e){}

				console.log('Viewer', data);

				$localStorage.flynet = data;
				console.log(data);

				self.init();
			},

			openTemplate: function(data){
				self.currentView = $localStorage.flynet.templates[data.id];
				self.currentViewId = data.id;
				self.currentPage = 0;

				self.updateTemplate();
			},

			init: function(){
				if($localStorage.flynet.lastTemplate){

					var page = $localStorage.flynet.lastPage || 0;

					if($localStorage.flynet.templates[$localStorage.flynet.lastTemplate]){
						self.currentView = $localStorage.flynet.templates[$localStorage.flynet.lastTemplate];
						self.currentViewId = $localStorage.flynet.lastTemplate;
						self.currentPage = page;

						self.updateTemplate();
					}else{
						self.postUpdate();
					}
				}
			}
		};

		self.init();

		return self;
	});
})(angular.module('presentationRender'));
