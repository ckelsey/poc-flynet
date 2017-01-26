(function(app){
	'use strict';

	app.controller('EditorViewCtlr', function($timeout, dataShareService, EditorVars, Utility, $scope, ElementModel, ElementActions, templateService, $rootScope, classesService, functionsService){

		$rootScope.editor = true;

		$scope.Utility = Utility;
		$scope.templateService = templateService;
		$scope.ElementModel = ElementModel;
		$scope.classesService = classesService;
		$scope.functionsService = functionsService;

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

						ElementModel.update(data.data, ElementActions.selectedElement);
					}
				}
			}
		}, 'self');

		$rootScope.$on('updateElementListeners', function(event, data){
			ElementActions.updateListeners(data);
		});

	});
})(angular.module('editorView', [
	'dataShare',
	'sidebarModule',
	'elementsModule',
	'stylingModule',
	'utility_module',
	'templatesModule',
	'projectBarModule',
	'htmlTreeModule',
	'functionsModule',
	'classesModule'
]));
