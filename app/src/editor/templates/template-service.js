(function(app){
	'use strict';

	app.service('templateService', function(dataShareService, EditorVars){

		var self = {

			newTemplateDialogOpen: false,
			importTemplatesDialogueOpen: false,
			canceling: false,

			newTemplate: function(data){
				if(self.canceling){
					self.canceling = false;
				}else{
					dataShareService.post({
						obj: 'newTemplate',
						data: data
					}, EditorVars.iframeSelector);
				}

				self.newTemplateDialogOpen = false;
				data = null;
			},

			importTemplate: function(data){
				if(self.canceling){
					self.canceling = false;
				}else{
					try{
						data = angular.toJson(data);
						data = angular.fromJson(data);
					}catch(e){}

					dataShareService.post({
						obj: 'importTemplate',
						data: data
					}, EditorVars.iframeSelector);

					self.importTemplatesDialogueOpen = false;
					data = null;
				}
			},

			cancel: function(){
				self.canceling = true;
				self.importTemplatesDialogueOpen = false;
				self.newTemplateDialogOpen = false;
			}
		};

		return self;
	});
})(angular.module('templatesModule', [
	'dataShare'
]));
