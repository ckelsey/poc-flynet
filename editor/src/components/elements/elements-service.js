(function(app){
	'use strict';

	app.service('ElementService', function(dataShareService, $timeout, EditorVars, Utility){

		var self = {

			currentElement: null,
			elementStructure: null,

			elements: {

				image: {
					icon: 'fa-picture-o',
					tag: 'img',
					content: [],
					attributes: {
						width: null,
						height: null,
						src: null,
					}
				},

				text: {
					icon: 'fa-font',
					tag: 'p',
					content: [],
					attributes: {}
				},

				box: {
					icon: 'fa-square-o',
					tag: 'div',
					content: [],
					attributes: {}
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

			moveElement: function(e){
				var overlay = document.getElementById('element-hover-overlay-wrapper');
				var innerOverlay = document.getElementById('element-hover-overlay-inner');

				function move(eR){
					var outerWidth = overlay.offsetWidth;
					var outerHeight = overlay.offsetHeight;
					var innerLeft = innerOverlay.offsetLeft;
					var innerTop = innerOverlay.offsetLeft;
					var width = (((eR.offsetX - innerLeft) / outerWidth) * 100) + '%';
					var height = (((eR.offsetY - innerTop) / outerHeight) * 100) + '%';

					innerOverlay.style.width = width;
					innerOverlay.style.height = height;
				}

				function doneMove(eD){
					document.removeEventListener('mousemove', move, false);
					document.removeEventListener('mouseup', doneMove, false);
					overlay.classList.remove('resize-mousedown');
					overlay.parentElement.removeChild(overlay);
				}

				overlay.classList.add('resize-mousedown');
				document.addEventListener('mousemove', move, false);
				document.addEventListener('mouseup', doneMove, false);
			},

			resizeElement: function(e){
				var overlay = document.getElementById('element-hover-overlay-wrapper');
				var innerOverlay = document.getElementById('element-hover-overlay-inner');
				var iframe = document.getElementById(EditorVars.iframeSelector.split('#')[1]);
				iframe = iframe.contentWindow || iframe;
				var doc = iframe.contentDocument || iframe.document;
				var button = this;

				function resize(eR){
					var scrollLeft = doc.body.scrollLeft;
					var scrollTop = doc.body.scrollTop;
					var outerWidth = overlay.offsetWidth;
					var outerHeight = overlay.offsetHeight;
					var innerLeft = innerOverlay.offsetLeft - 10;
					var innerTop = innerOverlay.offsetTop - 10;
					var width = (((eR.x - overlay.offsetLeft + (button.offsetWidth / 2)) / iframe.innerWidth) * 100) + '%';
					// var height = (((((eR.y - overlay.offsetTop) + scrollTop) + (button.offsetHeight / 2)) / outerHeight) * 100) + '%';

					//var height = (()) + (button.offsetHeight / 2)) / (iframe.innerHeight)) * 100) + '%';

					// var height = ((((eR.y - overlay.offsetTop) + doc.body.scrollTop) / (iframe.innerHeight + doc.body.scrollTop)) * 100) + '%';

					var height = ((eR.y / outerHeight) * 100) + '%';

					innerOverlay.style.width = width;
					innerOverlay.style.height = height;

					dataShareService.post({
						obj: 'resizeElement',
						data: {
							selector: overlay.getAttribute('element'),
							dimensions: {
								width: width,
								height: height
							}
						}
					}, EditorVars.iframeSelector);
				}

				function doneResize(eD){
					// var outerWidth = overlay.offsetWidth;
					// var outerHeight = overlay.offsetHeight;
					// var innerLeft = innerOverlay.offsetLeft - 10;
					// var innerTop = innerOverlay.offsetLeft - 10;
					// var width = (((eD.offsetX - innerLeft) / outerWidth) * 100) + '%';
					// var height = (((eD.offsetY - innerTop) / outerHeight) * 100) + '%';
					//
					// innerOverlay.style.width = width;
					// innerOverlay.style.height = height;

					document.removeEventListener('mousemove', resize, false);
					document.removeEventListener('mouseup', doneResize, false);
					overlay.classList.remove('resize-mousedown');

					if(overlay && overlay.parentElement){
						overlay.parentElement.removeChild(overlay);
					}
				}

				overlay.classList.add('resize-mousedown');
				document.addEventListener('mousemove', resize, false);
				document.addEventListener('mouseup', doneResize, false);
			},

			drawOverlay: function(el, iframe, doc, overlay){
				var elDimensions = el.getBoundingClientRect();
				var pageWidth = iframe.innerWidth;
				var pageHeight = doc.body.offsetHeight;
				var width = ((el.offsetWidth / pageWidth) * 100) + '%';
				var height = ((el.offsetHeight / pageHeight) * 100) + '%';
				var scrollLeft = doc.body.scrollLeft;
				var scrollTop = doc.body.scrollTop;
				var innerOverlay;

				var innerHtml = ''+
				// '<div class="edit-element-buttons">'+
				// '<div class="edit-element-button" id="edit-element-button-resize"><i class="fa fa-arrows-v"></i></div>'+
				// '<div class="edit-element-button" id="edit-element-button-move"><i class="fa fa-arrows"></i></div>'+
				// '</div>'
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

				// overlay.style.width = ((iframe.innerWidth / window.innerWidth) * 100) +'%';
				// overlay.style.height = ((iframe.innerHeight / window.innerHeight) * 100) +'%';
				overlay.style.width = doc.body.offsetWidth + 'px';
				overlay.style.height = doc.body.offsetHeight + 'px';
				overlay.setAttribute('element', el.id);

				innerOverlay.style.width = width;
				innerOverlay.style.height = height;
				innerOverlay.style.top = (elDimensions.top) + 'px';
				innerOverlay.style.left = (elDimensions.left) + 'px';
				innerOverlay.innerHTML = innerHtml;

				document.body.appendChild(overlay);

				/* TODO resize/move buttons */
				// document.getElementById('edit-element-button-resize').addEventListener('mousedown', self.resizeElement, false);
				// document.getElementById('edit-element-button-move').addEventListener('mousedown', self.moveElement, false);

				iframe.onscroll = self.reDrawOverlay;
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

			lastHoverElement: null,

			elementHoverEvent: function(e){
				var iframe = document.getElementById(EditorVars.iframeSelector.split('#')[1]);
				iframe = iframe.contentWindow || iframe;
				var doc = iframe.contentDocument || iframe.document;

				var overlay = document.querySelectorAll('#element-hover-overlay-wrapper');

				if(overlay){
					for(var i=0; i<overlay.length; i=i+1){
						overlay[i].parentElement.removeChild(overlay[i]);
					}
				}

				self.lastHoverElement = this;

				self.drawOverlay(this, iframe, doc);
			},

			elementLeaveEvent: function(e){
				var iframe = document.getElementById(EditorVars.iframeSelector.split('#')[1]);
				iframe = iframe.contentWindow || iframe;
				var doc = iframe.contentDocument || iframe.document;
				var overlayInner = document.getElementById('element-hover-overlay-inner');

				if(overlayInner){
					if(e.x >= overlayInner.offsetLeft && e.x <= overlayInner.offsetLeft + overlayInner.offsetWidth){
						if(e.y >= overlayInner.offsetTop && e.y <= overlayInner.offsetTop + overlayInner.offsetHeight){
							return false;
						}
					}
				}

				var overlay = document.querySelectorAll('#element-hover-overlay-wrapper');

				if(overlay){
					for(var i=0; i<overlay.length; i=i+1){
						overlay[i].parentElement.removeChild(overlay[i]);
					}
				}
			},

			selectedElement: null,
			elementClick: function(){
				self.selectedElement = {
					element: this
				};

				var path = this.getAttribute('data-path');
				if(path){
					path = path.split('.');
					var obj = self.elementStructure.pages[self.lastPage];

					for(var i=0; i<path.length; i=i+1){
						if(path[i] !== ''){
							obj = obj[path[i]];
						}
					}

					$timeout(function(){
						self.selectedElement.data = obj;
					});
				}
			},

			updateListeners: function(data){

				var iframe = document.getElementById(EditorVars.iframeSelector.split('#')[1]);
				iframe = iframe.contentWindow || iframe;

				function cycle(el){
					if(el){
						if(el.id){
							var iframeElement = iframe.document.getElementById(el.id);

							if(iframeElement){
								iframeElement.addEventListener('mouseenter', self.elementHoverEvent, false);
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

				cycle(data);
			},

			update: function(data){
				$timeout(function(){
					if(data.templates && Object.keys(data.templates).length){
						self.previousStructure = angular.copy(self.elementStructure);
						//self.updateListeners(self.previousStructure);

						self.lastPage = data.lastPage;
						self.lastId = data.lastTemplate;
						self.templateName = data.templates[data.lastTemplate].name;
						self.elementStructure = data.templates[data.lastTemplate];
						self.pageLength = data.templates[data.lastTemplate].pages.length;
						self.allData = data;

						if(data.lastTemplate){
							self.templateTitleString = Utility.trust_html(self.elementStructure.name + '<span>&nbsp;&nbsp;Page ' + (self.lastPage + 1) + ' of ' + self.pageLength + '</span>');
						}

						self.updateListeners(self.elementStructure.pages[self.lastPage], true);
					}else{

						self.lastPage = 0;
						self.lastId = null;
						self.templateName = null;
						self.pageLength = null;
						self.elementStructure = null;
						self.templateTitleString = null;
					}
				});
			}
		};

		return self;
	});

})(angular.module('elementsModule'));
