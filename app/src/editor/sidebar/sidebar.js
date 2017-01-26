(function(app){
	'use strict';

	app.directive('sidebarComponent', function(ElementModel, ElementActions, dataShareService, EditorVars, templateService, $timeout, Utility, classesService, functionsService){
		return {
			restrict: 'E',
			templateUrl: 'sidebar.html',
			link: function(scope, element, attributes){
				scope.ElementModel = ElementModel;
				scope.templateService = templateService;

				scope.getDate = function(history){
					return history.timeId ? Utility.format_date({timestamp: history.timeId, display: 'month_number/day_number/year_short hours:minutes:seconds:miliseconds am_pm'}) : 'sssss';
				};

				scope.undo = function(){
					dataShareService.post({obj:'undo'}, EditorVars.iframeSelector);
				};

				scope.redo = function(){
					dataShareService.post({obj:'redo'}, EditorVars.iframeSelector);
				};

				scope.openClasses = function(){
					classesService.dialogueOpen = true;
				};

				scope.openFunctions = function(){
					functionsService.dialogueOpen = true;
				};

				scope.goToHistory = function(index){
					dataShareService.post({obj:'goToHistory', data: index}, EditorVars.iframeSelector);
				};

				scope.openElementDrawer = function(){
					scope.templateDrawer = false;
					scope.drawerElementTree = false;
					scope.drawerHistory = false;
					scope.drawerElements = scope.drawerElements ? false : true;
				};

				scope.openElementTreeDrawer = function(){
					scope.templateDrawer = false;
					scope.drawerElements = false;
					scope.drawerHistory = false;
					scope.drawerElementTree = scope.drawerElementTree ? false : true;
				};

				scope.openTemplateDrawer = function(){
					scope.drawerElements = false;
					scope.drawerElementTree = false;
					scope.drawerHistory = false;
					scope.templateDrawer = scope.templateDrawer ? false : true;
				};

				scope.openHistory = function(){
					scope.drawerElements = false;
					scope.drawerElementTree = false;
					scope.templateDrawer = false;
					scope.drawerHistory = scope.drawerHistory ? false : true;
				};

				scope.reset = function(){
					scope.templateDrawer = false;
					scope.drawerElementTree = false;
					scope.drawerElements = false;
					ElementModel.reset();
					ElementActions.selectedElement = null;
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

				scope.treeData = _.get(ElementModel, 'elementStructure.pages[ElementModel.lastPage].content');

				scope.$watch(function(){ return _.get(ElementModel, 'elementStructure.pages'); }, function(n,o){
					$timeout(function(){
						if(n){
							scope.treeData = _.get(n[ElementModel.lastPage], 'content');
						}
					});
				});












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
	'templatesModule',
	'utility_module',
	'classesModule',
	'functionsModule'
]));
