(function(app){
	'use strict';

	app.service('classesService', function(){

		var self = {
			dialogueOpen: false,
			addClassDialogueOpen: false,
		};

		return self;
	});

})(angular.module('classesModule'));
