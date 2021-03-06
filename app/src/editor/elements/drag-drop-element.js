(function(app){
	'use strict';

	app.directive('dragDropElement', function(dataShareService, EditorVars) {
		return {
			restrict: 'E',
			link: function(scope, element, attributes) {

				function getIframe(){
					var iframe = document.querySelector(EditorVars.iframeSelector);

					if(iframe){
						if(iframe.contentWindow){
							return iframe.contentWindow;
						}
					}

					return iframe;
				}

				function getElement(target){

					while(!target.hasAttribute('view-element')){
						target = target.parentElement;
					}

					return target;
				}

				function placeItem(e){
					getIframe().removeEventListener('mouseup', placeItem, false);

					var target = e.target;

					if(target.tagName.toLowerCase() === 'html' || target.tagName.toLowerCase() === 'body'){
						target = 'body';
					}else{
						if(!target.id){
							target = getElement(target);
						}
						
						target = '#' + target.id;
					}

					var el = JSON.parse(attributes.element);

					dataShareService.post({
						obj: 'addElement',
						evt: {
							x: e.pageX,
							y: e.pageY,
							screenX: e.screenX,
							screenY: e.screenY,
							type: e.type,
							target: target
						},
						element: el
					}, EditorVars.iframeSelector);
				}

				element.bind('mousedown', function(){
					document.body.classList.add('mousedown');
					dataShareService.post('mousedown', EditorVars.iframeSelector);

					var iframe = getIframe();

					if(iframe){
						iframe.addEventListener('mouseup', placeItem, false);
					}
				});
			}
		};
	});


})(angular.module('elementsModule'));
