(function(app){
	'use strict';

	app.directive('sidebarComponent', function(ElementService, dataShareService, EditorVars, templateService){
		return {
			restrict: 'E',
			templateUrl: 'sidebar.html',
			link: function(scope, element, attributes){
				scope.ElementService = ElementService;
				scope.templateService = templateService;

				scope.reset = function(){
					dataShareService.post({obj:'currentView', method: 'reset'}, EditorVars.iframeSelector);
				};

				scope.newTemplate = function(){
					templateService.newTemplateDialogOpen = true;
				};

				scope.openTemplate = function(template) {

					dataShareService.post({obj:'openTemplate', data: template}, EditorVars.iframeSelector);
				};

				scope.importTemplate = function(data) {
					templateService.importTemplatesDialogueOpen = true;
					dataShareService.post({obj:'importTemplate', data: data}, EditorVars.iframeSelector);
				};












				scope.test = function(){

					dataShareService.post({
						obj:'currentView',
						data: {
							name: 'Demo',
							id: 'demo',
							content: [
								{
									id: 1234,
									tag: 'p',
									text: 'Hello, <i>how are you</i>?',
									content:[
										{
											id: 1235,
											tag: 'p',
											text: 'I\'m so super duper <b>AWESOME</i>!',
											content:[],
											attributes: {}
										}
									],
									attributes: {}
								}
							]
						}
					}, EditorVars.iframeSelector);
				};
			}
		};
	});

})(angular.module('sidebarModule', [
	'elementsModule',
	'dataShare',
	'templatesModule'
]));
