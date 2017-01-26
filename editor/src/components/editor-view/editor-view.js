(function(app){
	'use strict';

	app.controller('EditorViewCtlr', function($timeout, dataShareService, EditorVars, Utility, $scope, ElementService, templateService){
		$scope.Utility = Utility;
		$scope.templateService = templateService;
		$scope.ElementService = ElementService;

		window.addEventListener('mouseup', function(){
			document.body.classList.remove('mousedown');
			dataShareService.post('mouseup', EditorVars.iframeSelector);
		});

		dataShareService.listen(function(msg){

			var data = msg.data;

			if(data){
				if(data === 'mouseup'){

					document.body.classList.remove('mousedown');

				}else if(data.hasOwnProperty('obj') && data.obj){

					if(data.obj === 'htmlUpdate'){

						ElementService.update(data.data);
					}
				}
			}
		}, 'self');

	});
})(angular.module('editorView', [
	'dataShare',
	'sidebarModule',
	'elementsModule',
	'stylingModule',
	'utility_module',
	'templatesModule'
]));
