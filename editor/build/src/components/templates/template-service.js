(function(app){
	'use strict';

	app.service('templateService', function(dataShareService, EditorVars){
console.log('aaa')
		var self = {

			newTemplateDialogOpen: false,
			importTemplatesDialogueOpen: false,

			newTemplate: function(data){
				dataShareService.post({
					obj: 'newTemplate',
					data: data
				}, EditorVars.iframeSelector);

				self.newTemplateDialogOpen = false;
			},

			importTemplate: function(data){
				try{
					data = angular.toJson(data);
					data = angular.fromJson(data);
				}catch(e){}

				console.log('Editor', data);
				dataShareService.post({
					obj: 'importTemplate',
					data: data
				}, EditorVars.iframeSelector);

				self.importTemplatesDialogueOpen = false;
			}
		};

		return self;
	});
})(angular.module('templatesModule', [
	'dataShare'
]));
