module.exports = function (gulp, plugins, vars) {
	return function () {

		plugins.runSequence('move_to_build', function() {
			gulp.src([
				'./build/**'
			])
			.pipe(plugins.zip('Flynet Editor.interactive'))
			.pipe(gulp.dest(''));
		});
	};
};
