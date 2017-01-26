(function(app){
	'use strict';

	app.directive("textEdit", function($rootScope, $timeout, presentationService) {
		return {
			restrict: "A",
			require: "ngModel",
			link: function(scope, element, attrs, ngModel) {
				var oldVal = null;

				function read() {
					ngModel.$setViewValue(element.html());
				}

				ngModel.$render = function() {
					element.html(ngModel.$viewValue || "");
					
					if(oldVal !== ngModel.$viewValue){
						oldVal = ngModel.$viewValue;
						presentationService.updateTemplate();
						presentationService.postUpdate();
					}
				};

				element.bind("blur", function() {
					$timeout(function(){
						read();
					});
				});

				element.bind("input", function() {
					$timeout(function(){
						read();
					});
				});

				$rootScope.$on('saveTextEdit', function(){
					$timeout(function(){
						read();
					});
				});
			}
		};
	});
})(angular.module('presentationRender'));
