(function(app){
	'use strict';

	app.service('functionsService', function(){

		var self = {
			dialogueOpen: false,
			addFunctionDialogueOpen: false
		};

		return self;
	});

})(angular.module('functionsModule'));
