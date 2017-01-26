(function(app){
	'use strict';

	app.controller('ViewerCtlr', function(presentationService, dataShareService, $timeout){
		var self = this;
		this.presentationService = presentationService;
		this.dataShareService = dataShareService;

		function inIframe () {
			try {
				return window.self !== window.top;
			} catch (e) {
				return true;
			}
		}

		if(inIframe()){
			window.addEventListener('mouseup', function(){
				document.body.classList.remove('mousedown');
				dataShareService.post('mouseup', 'parent');
			});
		}

		dataShareService.listen(function(msg){
			$timeout(function(){

				var data = msg.data;

				if(data){
					if(data.hasOwnProperty('obj') && data.obj){

						if(data.obj === 'currentView'){

							if(data.hasOwnProperty('method') && data.method){
								presentationService[data.method](data.data);
							}else{
								presentationService.currentView = data.data;
							}
						}else if(data.obj === 'addElement'){
							presentationService.addElement(data);
						}else if(data.obj === 'resizeElement'){
							presentationService.resizeElement(data.data);
						}else if(data.obj === 'newTemplate'){
							presentationService.newTemplate(data.data);
						}else if(data.obj === 'importTemplate'){
							presentationService.importTemplate(data.data);
						}else if(data.obj === 'openTemplate'){
							presentationService.openTemplate(data.data);
						}
					}else{

						if(data === 'mousedown'){
							document.body.classList.add('mousedown');
						}else if(data === 'mouseup'){
							document.body.classList.remove('mousedown');
						}else if(data === 'newPage'){
							presentationService.newPage();
						}else if(data === 'nextPage'){
							presentationService.nextPage();
						}else if(data === 'previousPage'){
							presentationService.previousPage();
						}
					}
				}
			});

		}, 'self');

	});
})(angular.module('viewerView', [
	'presentationRender',
	'dataShare'
]));
