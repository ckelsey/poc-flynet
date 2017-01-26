(function(app){
	'use strict';

	app.directive('ruleRepeat', function(){

		return {
			restrict: 'E',
			templateUrl: 'rule-repeat.html',
			scope: {clss: '='}
		};
	});

})(angular.module('classesModule'));
