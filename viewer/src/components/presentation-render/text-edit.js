(function(app){
	'use strict';

	app.directive("textEdit", function() {
		return {
			restrict: "A",
			require: "ngModel",
			link: function(scope, element, attrs, ngModel) {

				function read() {
					ngModel.$setViewValue(element.html());
				}

				ngModel.$render = function() {
					element.html(ngModel.$viewValue || "");
				};

				element.bind("blur", function() {
					scope.$apply(read);
				});
			}
		};
	});
})(angular.module('presentationRender'));
