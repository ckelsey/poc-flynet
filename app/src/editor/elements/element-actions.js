(function(app){
	'use strict';

	app.service('ElementActions', function(dataShareService, $timeout, EditorVars, Utility, $rootScope, ElementModel, debouncer){

		var self = {

			selectedElement: null,
			overlayShowing: false,

			getElementObj: function(pathString){
				var obj;

				if(pathString){
					var path = pathString.split('.');
					obj = ElementModel.elementStructure.pages[ElementModel.lastPage];

					for(var i=0; i<path.length; i=i+1){
						if(path[i] !== ''){
							obj = obj[path[i]];
						}
					}
				}

				return obj;
			},

			selectElement: function(id){
				if(id){
					var iframeElement = document.getElementById(EditorVars.iframeSelector.split('#')[1]);
					var iframeWindow = iframeElement.contentWindow || iframeElement;
					var doc = iframeWindow.contentDocument || iframeWindow.document;

					var el = doc.getElementById(id);

					if(el){
						var obj = self.getElementObj(el.getAttribute('data-path'));

						if(obj){
							$timeout(function(){
								self.selectedElement = {
									element: el,
									data: obj
								};
							});
						}
					}
				}
			},

			drawOverlay: function(el, iframe, doc, overlay){
				self.removeOverlay();

				$timeout(function(){
					self.overlayShowing = true;
				});

				var elDimensions = el.getBoundingClientRect();
				var pageWidth = iframe.innerWidth;
				var pageHeight = doc.body.offsetHeight;
				var width = el.offsetWidth + 'px';
				var height = el.offsetHeight + 'px';
				var innerOverlay;

				var innerHtml = ''+
				// '<div class="edit-element-buttons">'+
				// '<div class="edit-element-button" id="edit-element-button-resize"><i class="fa fa-arrows-v"></i></div>'+
				// '<div class="edit-element-button" id="edit-element-button-move"><i class="fa fa-arrows"></i></div>'+
				// '</div>' +
				'';

				if(!overlay){
					overlay = document.createElement('div');
					overlay.id = "element-hover-overlay-wrapper";

					innerOverlay = document.createElement('div');
					innerOverlay.id = "element-hover-overlay-inner";
					overlay.appendChild(innerOverlay);
				}else{
					innerOverlay = document.getElementById('element-hover-overlay-inner');
				}

				if(innerOverlay){
					overlay.style.width = doc.body.offsetWidth + 'px';
					overlay.style.height = doc.body.offsetHeight + 'px';
					overlay.setAttribute('element', el.id);

					innerOverlay.style.width = width;
					innerOverlay.style.height = height;
					innerOverlay.style.top = (elDimensions.top) + 'px';
					innerOverlay.style.left = (elDimensions.left) + 'px';
					innerOverlay.innerHTML = innerHtml;

					document.body.appendChild(overlay);
				}


				// document.getElementById('edit-element-button-resize').addEventListener('mousedown', self.resizeElement, false);
				// document.getElementById('edit-element-button-move').addEventListener('mousedown', self.moveElement, false);

				iframe.onscroll = self.reDrawOverlay;
			},

			showOverlay: function(el){
				el = el || self.selectedElement.element;
				var iframe = document.getElementById(EditorVars.iframeSelector.split('#')[1]);
				iframe = iframe.contentWindow || iframe;
				var doc = iframe.contentDocument || iframe.document;

				self.drawOverlay(el, iframe, doc);
			},

			reDrawOverlay: function(e){
				var iframe = document.getElementById(EditorVars.iframeSelector.split('#')[1]);
				iframe = iframe.contentWindow || iframe;
				var doc = iframe.contentDocument || iframe.document;
				var overlay = document.getElementById('element-hover-overlay-wrapper');

				if(overlay){
					self.drawOverlay(self.lastHoverElement, iframe, doc, overlay);
				}
			},

			isOnOverlay: function(e){
				var overlayInner = document.getElementById('element-hover-overlay-inner');

				if(overlayInner){
					if(e.x >= overlayInner.offsetLeft && e.x <= overlayInner.offsetLeft + overlayInner.offsetWidth){
						if(e.y >= overlayInner.offsetTop && e.y <= overlayInner.offsetTop + overlayInner.offsetHeight){
							return true;
						}
					}
				}

				return false;
			},

			removeOverlay: function(){
				var overlay = document.querySelectorAll('#element-hover-overlay-wrapper');

				if(overlay){
					for(var i=0; i<overlay.length; i=i+1){
						overlay[i].parentElement.removeChild(overlay[i]);
					}
				}
				$timeout(function(){
					self.overlayShowing = false;
				});
			},

			lastHoverElement: null,

			elementHoverEvent: function(e){
				var iframe = document.getElementById(EditorVars.iframeSelector.split('#')[1]);
				iframe = iframe.contentWindow || iframe;
				var doc = iframe.contentDocument || iframe.document;

				self.removeOverlay();

				self.lastHoverElement = this;

				self.drawOverlay(this, iframe, doc);
			},

			elementLeaveEvent: function(e){

				// if(self.isOnOverlay(e)){
				// 	return;
				// }

				self.removeOverlay();
			},

			elementClick: function(){
				var id = this.id;
				debouncer({
					name: 'elementClick',
					fn: function(){
						var thisId = arguments[0];
						self.selectElement(thisId);
					},
					arguments: [id],
					time: 10
				});
			},

			updateListeners: function(data){

				var iframe = document.getElementById(EditorVars.iframeSelector.split('#')[1]);
				iframe = iframe.contentWindow || iframe;

				function cycle(el){
					if(el){
						if(el.id){
							var iframeElement = iframe.document.getElementById(el.id);

							if(iframeElement){
								iframeElement.addEventListener('mouseover', self.elementHoverEvent, true);
								iframeElement.addEventListener('mouseleave', self.elementLeaveEvent, false);
								iframeElement.addEventListener('click', self.elementClick, true);
							}

							if(iframeElement || el.name !== 'blank'){
								if(el.content && el.content.length){
									for(var i=0; i<el.content.length; i=i+1){
										cycle(el.content[i]);
									}
								}
							}
						}
					}
				}

				cycle(data.currentView);

				if(data.selectedElement){
					self.selectElement(data.selectedElement.data.id);
				}
			}
		};

		return self;
	});

})(angular.module('elementsModule'));
