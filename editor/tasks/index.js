module.exports = function (gulp, plugins, vars) {
	return function () {

		var d = plugins.q.defer();
		var fs = require('fs');

		var html = '<!doctype html>' + "\r" +
		'<html ng-app="app">' + "\r" +
		'<head>' + "\r" +
		"\t" + '<meta charset="utf-8">' + "\r" +
		"\t" + '<meta http-equiv="X-UA-Compatible" content="IE=edge">' + "\r" +
		"\t" + '<meta name="description" content="">' + "\r" +
		"\t" + '<meta name="viewport" content="width=device-width">' + "\r" +
		"\t" + '<title ng-bind="pageTitle" class="ng-binding">Mediafly</title>' + "\r" +
		//"\t" + '<link rel="icon" type="image/png" href="./favicon.png">' + "\r" +
		"\t" + '<link rel="stylesheet" href="dist/css/' + vars.appName + '_vendor.min.css">' + "\r" +
		"\t" + '<link rel="stylesheet" href="dist/css/' + vars.appName + '.min.css">' + "\r" +

		// "\t" + '<script>document.domain = (location.href.indexOf(\'dev\') > -1) ? "mediafly.dev" : "mediafly.com"; var urlPath = location.pathname.split(\'/\'); var baseUrl = \'/\'; if(urlPath.indexOf(\'interactive\') > -1){ var mcode = urlPath[0] === \'\' ? urlPath[1] : urlPath[0]; var slug = urlPath[0] === \'\' ? urlPath[3] : urlPath[2]; baseUrl = baseUrl + mcode + \'/interactive/\' + slug + \'/\'; } var require = { baseUrl: baseUrl }; document.write(\'<base href="\'+baseUrl+\'" />\');</script>' + "\r" +
		"\t" + '<script src="dist/js/' + vars.appName + '_vendor.min.js"></script>' + "\r" +
		"\t" + '<script src="dist/js/' + vars.appName + '.min.js"></script>' + "\r" +
		"\t" + '<base href="/" />' + "\r" +
		'</head>' + "\r" +
		'<body ng-controller="AppCtlr as app">' + "\r" +
		"\t" + '<div ng-view=""></div>' + "\r" +

		'</body>' + "\r" +
		'</html>';

		fs.writeFile('./index.html', html, function() {
			d.resolve(true);
		});

		return d.promise;
	};
};
