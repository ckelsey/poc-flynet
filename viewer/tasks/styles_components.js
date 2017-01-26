module.exports = function (gulp, plugins, vars) {
	return function () {

		gulp.src(vars.stylesComponents)
		.pipe(plugins.plumber(vars.plumberErrorHandler))
		.pipe(plugins.flatmap(function(stream, file){
			var path = file.path.split('/src/')[1].split('/');
			path.pop();
			path.pop();
			path = path.join('/');

			return stream
			.pipe(plugins.sass().on('error', plugins.sass.logError))
			.pipe(gulp.dest('dist/'+path));
		}));
	};
};
